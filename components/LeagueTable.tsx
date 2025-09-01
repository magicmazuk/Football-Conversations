import React from 'react';
import { LeagueTableRow } from '../types';
import { TableIcon } from './icons/TableIcon';

interface LeagueTableProps {
  tableData: LeagueTableRow[];
  favoriteTeam: string;
}

export const LeagueTable: React.FC<LeagueTableProps> = ({ tableData, favoriteTeam }) => {
  if (!tableData || tableData.length === 0) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-border-color">
      <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center">
        <TableIcon className="w-5 h-5 text-gray-500" />
        <span className="ml-2">League Standings</span>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-secondary uppercase bg-gray-100 rounded-t-lg">
            <tr>
              <th scope="col" className="px-2 py-2 text-center">Pos</th>
              <th scope="col" className="px-4 py-2">Team</th>
              <th scope="col" className="px-2 py-2 text-center">P</th>
              <th scope="col" className="px-2 py-2 text-center">GD</th>
              <th scope="col" className="px-2 py-2 text-center">Pts</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => {
              const isFavorite = row.teamName.toLowerCase().includes(favoriteTeam.toLowerCase());
              return (
                <tr key={index} className={`border-b border-border-color last:border-b-0 ${isFavorite ? 'bg-indigo-100 text-brand-primary font-bold' : ''}`}>
                  <td className="px-2 py-2 text-center">{row.position}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{row.teamName}</td>
                  <td className="px-2 py-2 text-center">{row.played}</td>
                  <td className="px-2 py-2 text-center">{row.goalDifference}</td>
                  <td className="px-2 py-2 text-center">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
