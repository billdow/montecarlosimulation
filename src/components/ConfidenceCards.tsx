import React from 'react';
import { ConfidenceIntervals } from '../types';
import { formatDate } from '../utils/dateUtils';

interface ConfidenceCardsProps {
  confidenceIntervals: ConfidenceIntervals;
}

export function ConfidenceCards({ confidenceIntervals }: ConfidenceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
        <h3 className="text-sm font-semibold text-gray-600">30% Confidence</h3>
        <p className="text-2xl font-bold text-pink-500">{confidenceIntervals.p30.days} days</p>
        <p className="text-sm text-pink-600 mt-1">End: {formatDate(confidenceIntervals.p30.date)}</p>
      </div>
      <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
        <h3 className="text-sm font-semibold text-gray-600">70% Confidence</h3>
        <p className="text-2xl font-bold text-teal-500">{confidenceIntervals.p70.days} days</p>
        <p className="text-sm text-teal-600 mt-1">End: {formatDate(confidenceIntervals.p70.date)}</p>
      </div>
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
        <h3 className="text-sm font-semibold text-gray-600">90% Confidence</h3>
        <p className="text-2xl font-bold text-amber-500">{confidenceIntervals.p90.days} days</p>
        <p className="text-sm text-amber-600 mt-1">End: {formatDate(confidenceIntervals.p90.date)}</p>
      </div>
    </div>
  );
}