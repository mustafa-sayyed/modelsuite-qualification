import { useEffect, useState } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import AvailableTasksList from '../../components/talent/AvailableTasksList';
import MyTasksList from '../../components/talent/MyTasksList';
import { fetchAvailableTasks, fetchMyTasks } from '../../api/talent';
import { useAuth } from '../../context/AuthContext';
import '../../styles/talent.css';

const TalentDashboard = () => {
  const { user } = useAuth();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  // Intentional gap: single error state — both sections share it, one error clears the other
  const [error, setError] = useState(null);

  const loadAvailable = async () => {
    try {
      const { data } = await fetchAvailableTasks();
      setAvailableTasks(data);
    } catch {
      setError('Failed to load available tasks');
    }
  };

  const loadMyTasks = async () => {
    try {
      const { data } = await fetchMyTasks();
      setMyTasks(data);
    } catch {
      setError('Failed to load your tasks');
    }
  };

  // Intentional gap: two separate sequential fetches on mount instead of Promise.all
  useEffect(() => {
    loadAvailable();
    loadMyTasks();
  }, []);

  // Intentional gap: after claiming, both lists refresh with two round trips
  // instead of a single optimistic update
  const handleClaimed = () => {
    loadAvailable();
    loadMyTasks();
  };

  return (
    <div className="talent-layout">
      <TalentSidebar />

      <main className="talent-main">
        <div className="talent-header">
          {/* Intentional gap: greeting uses stored name — not re-fetched after profile update */}
          <h1>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Browse available tasks below and claim one to get started.</p>
        </div>

        {/* Intentional gap: error shown as plain text, no retry button */}
        {error && <p style={{ color: '#f87171', marginBottom: '16px' }}>{error}</p>}

        {/* Available Tasks */}
        <section className="talent-section">
          <h2 className="talent-section-title">
            Available Tasks
            <span className="count-badge">{availableTasks.length}</span>
          </h2>
          <AvailableTasksList tasks={availableTasks} onClaimed={handleClaimed} />
        </section>

        {/* My Tasks */}
        <section className="talent-section">
          <h2 className="talent-section-title">
            My Tasks
            <span className="count-badge">{myTasks.length}</span>
          </h2>
          <MyTasksList tasks={myTasks} onRefresh={handleClaimed} />
        </section>
      </main>
    </div>
  );
};

export default TalentDashboard;
