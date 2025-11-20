/**
 * Test suite for the dataService module.
 *
 * This file contains unit tests for the dataService functions, specifically
 * focusing on the signUp logic and duplicate prevention.
 *
 * @module dataService.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dataService } from './dataService';
import { getDoc, updateDoc } from 'firebase/firestore';

// Mock Firebase modules
vi.mock('../firebase', () => ({
  db: {}
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn()
}));

describe('dataService.signUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject duplicate signup even with trailing spaces', async () => {
    const placementId = 'placement123';
    const existingStudent = 'John Doe';
    const newStudent = ' John Doe '; // Same name with spaces

    // Mock existing placement with one signup
    const mockPlacementData = {
      capacity: 5,
      signUps: [
        { name: existingStudent, isDriver: false, passengerCapacity: 0 }
      ]
    };

    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockPlacementData
    });

    // Attempt to sign up with the spaced name
    const result = await dataService.signUp(placementId, newStudent, false, 0);

    // Expect the signup to fail because it's a duplicate
    expect(result.success).toBe(false);
    expect(result.message).toBe('You have already signed up for this placement.');

    // Verify that updateDoc was NOT called
    expect(updateDoc).not.toHaveBeenCalled();
  });
});
