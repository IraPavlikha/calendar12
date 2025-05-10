import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from './theme'; // Імпортуємо тип теми

interface HeaderProps {
  month: string;
  year: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  currentDate: Date;
  theme: Theme; // Додаємо тему як проп
}

const Header: React.FC<HeaderProps> = ({
  month,
  year,
  onPrevMonth,
  onNextMonth,
  onToday,
  currentDate,
  theme
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDay, setCurrentDay] = useState<string>('');
  const today = new Date();
  const isToday =
    currentDate.getDate() === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' });

      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      setCurrentDay(dayOfWeek);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const textColor = theme === 'dark' ? '#fff' : '#000'; // Вибір кольору тексту в залежності від теми

  return (
    <View style={[styles.header, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
      <View style={styles.timeContainer}>
        <Text style={[styles.time, { color: textColor }]}>{currentTime}</Text>
        <Text style={[styles.day, { color: textColor }]}>{currentDay}</Text>
      </View>

      <View style={styles.mainContent}>
        <TouchableOpacity onPress={onPrevMonth}>
          <Text style={[styles.arrow, { color: textColor }]}>{"△"}</Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.title,
            { color: textColor },
            isToday && styles.todayHighlight
          ]}
        >
          {month} {year}
        </Text>

        <TouchableOpacity onPress={onNextMonth}>
          <Text style={[styles.arrow, { color: textColor }]}>{"▽"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onToday} style={[styles.todayButton, { backgroundColor: theme === 'dark' ? '#555' : '#ddd' }]}>
          <Text style={[styles.today, { color: textColor }]}>Today</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  timeContainer: {
    alignItems: 'right',
    marginBottom: 10,
  },
  time: {
    fontSize: 40,
  },
  day: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
  todayHighlight: {
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 25,
  },
  todayButton: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  today: {
    fontSize: 18,
  },
});

export default Header;
