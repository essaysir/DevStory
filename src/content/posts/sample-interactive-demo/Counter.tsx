import { useState } from 'react';

export default function Counter({ start = 0 }: { start?: number }) {
  const [count, setCount] = useState(start);
  return <button onClick={() => setCount(count + 1)}>{`누른 횟수: ${count}`}</button>;
}
