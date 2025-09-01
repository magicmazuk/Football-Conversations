import React, { useState, useMemo, useEffect } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface TeamSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentFavorite: string;
    onSetFavorite: (team: string) => void;
    allTeams: string[];
}

export const TeamSelectionModal: React.FC<TeamSelectionModalProps> = ({ isOpen, onClose, currentFavorite, onSetFavorite, allTeams }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTeams = useMemo(() => {
        if (!searchTerm) return allTeams;
        return allTeams.filter(team => team.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm, allTeams]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
           window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!isOpen) return null;

    const handleSelect = (team: string) => {
        onSetFavorite(team);
        // No need to call onClose here, as the parent's onSetFavorite handler does it.
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center animate-fade-in" 
            onClick={onClose} 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="bg-card-bg rounded-xl shadow-2xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-border-color flex justify-between items-center">
                    <h2 id="modal-title" className="text-xl font-bold text-text-primary">Select Your Favorite Team</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label="Close modal">
                        <CloseIcon />
                    </button>
                </div>
                <div className="p-5">
                    <input
                        type="text"
                        placeholder="Search for a team..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-border-color rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none mb-4"
                        aria-label="Search for a team"
                        autoFocus
                    />
                    <ul className="max-h-80 overflow-y-auto divide-y divide-border-color -mx-5">
                        {filteredTeams.length > 0 ? filteredTeams.map(team => (
                            <li key={team}>
                                <button
                                    onClick={() => handleSelect(team)}
                                    className={`w-full text-left px-5 py-2.5 transition-colors text-text-primary ${team === currentFavorite ? 'bg-indigo-100 text-brand-primary font-semibold' : 'hover:bg-gray-100'}`}
                                >
                                    {team}
                                </button>
                            </li>
                        )) : (
                            <li className="px-5 py-4 text-center text-text-secondary">No teams found.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};