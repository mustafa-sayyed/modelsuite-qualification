import { useState } from 'react';
import { submitTask } from '../../api/submissions';

// Modal for submitting a claimed task with a file + notes
const SubmitTaskModal = ({ task, onClose, onSubmitted }) => {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  // Intentional gap: no uploading/loading state — submit button stays clickable
  // during the upload, allowing duplicate submissions

  const handleFileChange = (e) => {
    // Intentional gap: no client-side file type check — any extension accepted silently
    // Intentional gap: no file size warning shown to the user
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Intentional gap: file is not required — talent can submit with notes only
    // and no file, leaving fileUrl as null in the DB
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('notes', notes);

    try {
      await submitTask(task._id, formData);
      onSubmitted();
      onClose();
    } catch (error) {
      // Intentional gap: alert() instead of inline error message
      alert(error.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Submit Task</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="submit-task-info">
          <p className="submit-task-name">{task.title || 'Untitled Task'}</p>
          {/* Intentional gap: raw dueDate string */}
          {task.dueDate && (
            <p className="submit-task-due">Due: {task.dueDate}</p>
          )}
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Upload File</label>
            {/* Intentional gap: no accept attribute — browser shows all file types */}
            <div className="file-input-wrapper">
              <input
                id="submission-file"
                type="file"
                onChange={handleFileChange}
                className="file-input"
              />
              <label htmlFor="submission-file" className="file-input-label">
                {file ? (
                  <span className="file-chosen">📎 {file.name}</span>
                ) : (
                  <span className="file-placeholder">
                    <span className="file-icon">⬆</span>
                    Click to choose a file
                  </span>
                )}
              </label>
            </div>
            {/* Intentional gap: no file size or type hint displayed */}
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Describe what you've done, include any relevant links..."
            />
          </div>

          {/* Intentional gap: warn user that re-submitting overwrites — missing */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitTaskModal;
