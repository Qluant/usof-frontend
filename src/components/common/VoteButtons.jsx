import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function VoteButtons({ score = 0, userVote = null, onVote }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [currentScore, setCurrentScore] = useState(parseInt(score, 10) || 0);
  const [currentVote, setCurrentVote] = useState(userVote);

  useEffect(() => {
    setCurrentScore(parseInt(score, 10) || 0);
  }, [score]);

  useEffect(() => {
    setCurrentVote(userVote);
  }, [userVote]);

  const handleVote = async (type) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    let delta = 0;
    let nextVote = null;

    if (currentVote === type) {
      delta = type === 'like' ? -1 : 1;
      nextVote = null;
    } else if (currentVote) {
      delta = type === 'like' ? 2 : -2;
      nextVote = type;
    } else {
      delta = type === 'like' ? 1 : -1;
      nextVote = type;
    }

    setCurrentScore((prev) => parseInt(prev, 10) + delta);
    setCurrentVote(nextVote);

    if (onVote) {
      await onVote(type);
    }
  };

  return (
    <div className="voting-controls">
      <button
        onClick={() => handleVote('like')}
        className={`vote-btn ${currentVote === 'like' ? 'active-like' : ''}`}
        title="This question shows research effort; it is useful and clear"
      >
        <ChevronUp size={24} />
      </button>

      <span className="vote-score">{currentScore}</span>

      <button
        onClick={() => handleVote('dislike')}
        className={`vote-btn ${currentVote === 'dislike' ? 'active-dislike' : ''}`}
        title="This question does not show any research effort; it is unclear or not useful"
      >
        <ChevronDown size={24} />
      </button>
    </div>
  );
}
