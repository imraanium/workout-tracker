import type { ProgressSeries, Timeframe } from '../types/workout';

export const progressSeries: ProgressSeries[] = [
{
  id: 'bench-press',
  name: 'Bench Press',
  type: 'strength',
  metrics: [
  { id: 'primary', label: 'Max Weight', unit: 'lbs' },
  { id: 'secondary', label: 'Total Volume', unit: 'lbs' }],

  points: [
  { date: 'Sep', primary: 155, secondary: 7750, sets: 11 },
  { date: 'Oct', primary: 160, secondary: 8320, sets: 12 },
  { date: 'Nov', primary: 160, secondary: 8640, sets: 13 },
  { date: 'Dec', primary: 165, secondary: 8250, sets: 11 },
  { date: 'Jan', primary: 170, secondary: 9180, sets: 13 },
  { date: 'Feb', primary: 170, secondary: 9520, sets: 14 },
  { date: 'Mar', primary: 175, secondary: 9800, sets: 14 },
  { date: 'Apr', primary: 175, secondary: 10150, sets: 15 },
  { date: 'May', primary: 180, secondary: 10440, sets: 15 },
  { date: 'Jun', primary: 185, secondary: 10730, sets: 15 },
  { date: 'Jul', primary: 185, secondary: 11100, sets: 16 },
  { date: 'Aug', primary: 190, secondary: 11780, sets: 17 }],

  pr: { value: '190 lbs', caption: 'Aug 26 · 4 reps' },
  oneRm: '211 lbs'
},
{
  id: 'back-squat',
  name: 'Back Squat',
  type: 'strength',
  metrics: [
  { id: 'primary', label: 'Max Weight', unit: 'lbs' },
  { id: 'secondary', label: 'Total Volume', unit: 'lbs' }],

  points: [
  { date: 'Sep', primary: 225, secondary: 12400, sets: 12 },
  { date: 'Oct', primary: 235, secondary: 13100, sets: 13 },
  { date: 'Nov', primary: 240, secondary: 13850, sets: 14 },
  { date: 'Dec', primary: 240, secondary: 12900, sets: 12 },
  { date: 'Jan', primary: 250, secondary: 14600, sets: 14 },
  { date: 'Feb', primary: 255, secondary: 15200, sets: 15 },
  { date: 'Mar', primary: 260, secondary: 15750, sets: 15 },
  { date: 'Apr', primary: 265, secondary: 16300, sets: 16 },
  { date: 'May', primary: 265, secondary: 16900, sets: 16 },
  { date: 'Jun', primary: 275, secondary: 17400, sets: 17 },
  { date: 'Jul', primary: 280, secondary: 18050, sets: 17 },
  { date: 'Aug', primary: 285, secondary: 18900, sets: 18 }],

  pr: { value: '285 lbs', caption: 'Aug 28 · 3 reps' },
  oneRm: '302 lbs'
},
{
  id: 'tempo-run',
  name: 'Tempo Run',
  type: 'running',
  metrics: [
  { id: 'primary', label: 'Running Pace', unit: 'min/mi', invert: true },
  { id: 'secondary', label: 'Weekly Distance', unit: 'mi' }],

  points: [
  { date: 'Sep', primary: 8.9, secondary: 12, sets: 4 },
  { date: 'Oct', primary: 8.8, secondary: 14, sets: 5 },
  { date: 'Nov', primary: 8.6, secondary: 15, sets: 5 },
  { date: 'Dec', primary: 8.7, secondary: 13, sets: 4 },
  { date: 'Jan', primary: 8.4, secondary: 16, sets: 6 },
  { date: 'Feb', primary: 8.3, secondary: 18, sets: 6 },
  { date: 'Mar', primary: 8.2, secondary: 19, sets: 7 },
  { date: 'Apr', primary: 8.1, secondary: 20, sets: 7 },
  { date: 'May', primary: 8.0, secondary: 22, sets: 8 },
  { date: 'Jun', primary: 7.9, secondary: 23, sets: 8 },
  { date: 'Jul', primary: 7.85, secondary: 24, sets: 8 },
  { date: 'Aug', primary: 7.8, secondary: 26, sets: 9 }],

  pr: { value: '7:48 /mi', caption: 'Aug 30 · 5.2 mi' },
  oneRm: '6:52 /mi'
}];


export const timeframes: {id: Timeframe;label: string;points: number;}[] = [
{ id: '1M', label: '1M', points: 2 },
{ id: '3M', label: '3M', points: 4 },
{ id: '6M', label: '6M', points: 7 },
{ id: '1Y', label: '1Y', points: 12 },
{ id: 'ALL', label: 'ALL', points: 12 }];