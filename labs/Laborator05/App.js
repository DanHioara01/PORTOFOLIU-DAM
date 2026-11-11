import { ScrollView } from 'react-native';
import ProgressBarDemo from './components/ProgressBarDemo';
import StopwatchDemo from './components/StopwatchDemo';

export default function App() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
      <ProgressBarDemo />
      <StopwatchDemo />
    </ScrollView>
  );
}
