import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  addMonths,
  subMonths,
  startOfMonth,
  getDay,
  getDaysInMonth,
  format,
} from 'date-fns';
import { uk, enUS } from 'date-fns/locale';

import Header from './Header';
import Day from './Day';
import TaskList from './TaskList';

import { useLanguage } from './LanguageContext'; // <-- імпорт контексту

const { width, height } = Dimensions.get('window');

const locales = { uk, enUS };

const Calendar: React.FC<{ theme: string }> = ({ theme }) => {
  const { language, setLanguage } = useLanguage();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const locale = language === 'uk' ? uk : enUS;

  useEffect(() => {
    setCurrentMonth(format(currentDate, 'MMMM', { locale }));
    setCurrentYear(currentDate.getFullYear());
  }, [currentDate, locale]);

  const generateCalendarDays = (date: Date) => {
    const startOfCurrentMonth = startOfMonth(date);
    const startDay = getDay(startOfCurrentMonth);
    const totalDaysInCurrentMonth = getDaysInMonth(date);
    const prevMonthDays = getDaysInMonth(subMonths(date, 1));

    const days: number[] = [];

    for (let i = prevMonthDays - startDay + 1; i <= prevMonthDays; i++) {
      days.push(-i);
    }

    for (let i = 1; i <= totalDaysInCurrentMonth; i++) {
      days.push(i);
    }

    const totalDaysInNextMonth = 42 - days.length;
    for (let i = 1; i <= totalDaysInNextMonth; i++) {
      days.push(-i);
    }

    return days;
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handleToday = () => setCurrentDate(new Date());

  const getWeekDays = (locale: Locale) => {
    const baseDate = new Date(2021, 0, 3);
    return Array.from({ length: 7 }).map((_, i) =>
      format(new Date(baseDate.getTime() + i * 86400000), 'EE', { locale }),
    );
  };

  const weekDays = getWeekDays(locale);
  const days = generateCalendarDays(currentDate);

  const handleDayPress = (day: number) => {
    if (day > 0) {
      const selectedDate = new Date(currentYear, currentDate.getMonth(), day);
      setSelectedDay(selectedDate);
      setIsModalVisible(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'light' ? '#f5f5f5' : '#222' }]}>
      {/* Перемикач мов */}
      <View style={styles.languageSwitcher}>
        <TouchableOpacity
          style={[styles.langButton, language === 'uk' && styles.langButtonActive]}
          onPress={() => setLanguage('uk')}
        >
          <Text style={[styles.langText, language === 'uk' && styles.langTextActive]}>Українська</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langButton, language === 'en' && styles.langButtonActive]}
          onPress={() => setLanguage('en')}
        >
          <Text style={[styles.langText, language === 'en' && styles.langTextActive]}>English</Text>
        </TouchableOpacity>
      </View>

      <Header
        month={currentMonth}
        year={currentYear}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        currentDate={currentDate}
        theme={theme}
      />

      <View style={styles.weekdaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekday}>
            <Text style={[styles.weekdayText, { color: theme === 'light' ? '#000' : '#fff' }]}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {days.map((day, index) => (
          <Day
            key={index}
            day={Math.abs(day)}
            isCurrentMonth={day > 0}
            isToday={
              day === new Date().getDate() &&
              currentMonth === format(new Date(), 'MMMM', { locale }) &&
              currentYear === new Date().getFullYear()
            }
            isInRange={false}
            onPress={() => handleDayPress(day)}
            theme={theme}
          />
        ))}
      </View>

      {selectedDay !== null && (
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
            <View style={[styles.modalContent, { backgroundColor: theme === 'light' ? '#fff' : '#333' }]}>
              <TaskList day={selectedDay} onClose={() => setIsModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  languageSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  langButton: {
    marginHorizontal: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#888',
  },
  langButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  langText: {
    color: '#888',
    fontWeight: '600',
  },
  langTextActive: {
    color: '#fff',
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  weekday: {
    width: '13%',
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.75,
    height: height * 0.75,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Calendar;
