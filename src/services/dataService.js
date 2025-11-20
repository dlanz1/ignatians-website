/**
 * Data service module for interacting with Firebase Firestore.
 *
 * This module provides a unified interface for all database operations, including
 * fetching, adding, updating, and deleting placements, as well as handling
 * student sign-ups and notifications.
 *
 * @module dataService
 */

import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';

const PLACEMENTS_COLLECTION = 'placements';
const NOTIFICATIONS_COLLECTION = 'notifications';

const initialData = {
  placements: [
    {
      name: 'Guadalupe Homeless Project',
      description: 'Supporting homeless individuals through Proyecto Pastoral.',
      detailedDescription: 'Partner with Proyecto Pastoral to provide essential services and support to homeless individuals in Los Angeles. This placement involves serving meals, distributing supplies, and offering compassionate assistance to those experiencing homelessness. Volunteers work directly with the community to promote dignity and provide hope through practical support and human connection.',
      day: 'TBD',
      time: 'TBD',
      capacity: 5,
      location: 'Los Angeles',
      address: '135 N. Mission Rd., Los Angeles, CA 90033',
      mapLink: 'https://www.google.com/maps/dir/?api=1&destination=135+N.+Mission+Rd.+Los+Angeles+CA+90033',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
      signUps: []
    },
    {
      name: 'Juvenile Hall',
      description: 'Mentoring and supporting youth in the juvenile justice system.',
      detailedDescription: 'Work with youth at Los Padrinos Juvenile Hall to provide mentorship, educational support, and positive guidance. Volunteers engage in one-on-one mentoring, facilitate group activities, and help young people develop life skills and hope for their future. This placement focuses on rehabilitation, second chances, and breaking cycles through compassionate engagement.',
      day: 'TBD',
      time: 'TBD',
      capacity: 4,
      location: 'Los Angeles',
      address: '7285 Quill Dr., Downey, CA 90242',
      mapLink: 'https://www.google.com/maps/dir/?api=1&destination=7285+Quill+Dr.+Downey+CA+90242',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop',
      signUps: []
    },
    {
      name: 'Heal the Bay',
      description: 'Environmental conservation and beach cleanup activities.',
      detailedDescription: 'Join Heal the Bay in protecting and restoring the health of coastal waters and watersheds. Volunteers participate in beach cleanups, assist at the Santa Monica Pier Aquarium, and help educate the public about marine conservation. This hands-on environmental service helps preserve our ocean ecosystems and promotes environmental stewardship in the community.',
      day: 'TBD',
      time: 'TBD',
      capacity: 6,
      location: 'Santa Monica',
      address: '1600 Ocean Front Walk, Santa Monica, CA 90401',
      mapLink: 'https://www.google.com/maps/dir/?api=1&destination=1600+Ocean+Front+Walk+Santa+Monica+CA+90401',
      image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=1200&auto=format&fit=crop',
      signUps: []
    },
    {
      name: 'Ascot Hills',
      description: 'Park maintenance and community beautification.',
      detailedDescription: 'Contribute to the beautification and maintenance of Ascot Hills Park in the El Sereno neighborhood. Volunteers engage in trail maintenance, native plant restoration, litter cleanup, and general park improvements. This service helps create accessible green spaces for the community while promoting environmental stewardship and connecting with nature.',
      day: 'TBD',
      time: 'TBD',
      capacity: 5,
      location: 'Los Angeles',
      address: '4371 Multnomah St., Los Angeles, CA 90032',
      mapLink: 'https://www.google.com/maps/dir/?api=1&destination=4371+Multnomah+St.+Los+Angeles+CA+90032',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop',
      signUps: []
    },
    {
      name: 'Francisco Homes',
      description: 'Supporting individuals with developmental disabilities.',
      detailedDescription: 'Serve at The Francisco Homes, a faith-based organization providing transitional housing and comprehensive re-entry services to formerly incarcerated individuals. Volunteers assist with life skills training, job readiness programs, and provide community support. This placement focuses on rehabilitation, dignity, and helping individuals successfully reintegrate into society.',
      day: 'TBD',
      time: 'TBD',
      capacity: 4,
      location: 'Los Angeles',
      address: '1224 W 40th Pl., Los Angeles, CA 90037',
      mapLink: 'https://www.google.com/maps/dir/?api=1&destination=1224+W+40th+Pl.+Los+Angeles+CA+90037',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop',
      signUps: []
    },
    {
      name: 'LA LGBT Center',
      description: 'Supporting LGBTQ+ community programs and services.',
      detailedDescription: 'Volunteer at the Los Angeles LGBT Center, one of the largest and most experienced LGBTQ organizations in the world. Support vital programs including health services, cultural arts, youth services, and community outreach. Volunteers help create a safe, welcoming environment and assist with events, programs, and services that support the LGBTQ+ community.',
      day: 'TBD',
      time: 'TBD',
      capacity: 5,
      location: 'Hollywood',
      address: '1625 N. Schrader Blvd., Los Angeles, CA 90028',
      mapLink: 'https://www.google.com/maps/dir/?api=1&destination=1625+N.+Schrader+Blvd.+Los+Angeles+CA+90028',
      image: 'https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=1200&auto=format&fit=crop',
      signUps: []
    },
    {
      name: 'St. Jerome Catholic School',
      description: 'Tutoring and mentoring elementary school students.',
      detailedDescription: 'Mentor and tutor elementary students at St. Jerome Catholic School. Volunteers work one-on-one or in small groups to provide academic support, homework help, and positive role modeling. This placement offers the opportunity to make a direct impact on young students\' educational journey while fostering a love of learning and personal growth.',
      day: 'TBD',
      time: 'TBD',
      capacity: 6,
      location: 'Los Angeles',
      address: '5580 Thornburn St., Los Angeles, CA 90045',
      mapLink: 'https://www.google.com/maps/dir/?api=1&destination=5580+Thornburn+St.+Los+Angeles+CA+90045',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop',
      signUps: []
    }
  ]
};

/**
 * Object containing methods for interacting with the data.
 */
export const dataService = {
  /**
   * Subscribes to real-time updates for placements.
   *
   * @param {Function} callback - A function that receives the list of placements.
   * @returns {Function} An unsubscribe function to stop listening for updates.
   */
  subscribeToPlacements: (callback) => {
    const q = query(collection(db, PLACEMENTS_COLLECTION));
    return onSnapshot(q, (snapshot) => {
      const placements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(placements);
    });
  },

  /**
   * Fetches all placements from the database.
   * Seeds initial data if the collection is empty.
   *
   * @async
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of placement objects.
   */
  getPlacements: async () => {
    const querySnapshot = await getDocs(collection(db, PLACEMENTS_COLLECTION));

    // Seed data if empty
    if (querySnapshot.empty) {
      const promises = initialData.placements.map(p =>
        addDoc(collection(db, PLACEMENTS_COLLECTION), p)
      );
      await Promise.all(promises);

      // Fetch again after seeding
      const newSnapshot = await getDocs(collection(db, PLACEMENTS_COLLECTION));
      return newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Adds a new placement to the database.
   *
   * @async
   * @param {Object} placement - The placement object to add.
   * @returns {Promise<Object>} A promise that resolves to the added placement object with its generated ID.
   */
  addPlacement: async (placement) => {
    const newPlacement = { ...placement, signUps: [] };
    const docRef = await addDoc(collection(db, PLACEMENTS_COLLECTION), newPlacement);
    return { id: docRef.id, ...newPlacement };
  },

  /**
   * Updates an existing placement in the database.
   * If capacity is reduced below current signups, it notifies affected students.
   *
   * @async
   * @param {string} id - The ID of the placement to update.
   * @param {Object} updatedFields - An object containing the fields to update.
   * @returns {Promise<Object|null>} A promise that resolves to the updated placement object, or null if not found.
   */
  updatePlacement: async (id, updatedFields) => {
    const placementRef = doc(db, PLACEMENTS_COLLECTION, id);
    const placementSnap = await getDoc(placementRef);

    if (placementSnap.exists()) {
      const original = placementSnap.data();

      // Check for capacity reduction
      if (updatedFields.capacity < (original.signUps?.length || 0)) {
        const message = `URGENT: The capacity for "${original.name}" on ${original.day} has been reduced to ${updatedFields.capacity}. Since there are ${original.signUps.length} people signed up, please check with the board to see if you still have a spot.`;

        const notificationPromises = original.signUps.map(student =>
          addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
            userName: student.name,
            message: message,
            date: new Date().toISOString(),
            read: false
          })
        );
        await Promise.all(notificationPromises);
      }

      await updateDoc(placementRef, updatedFields);
      return { id, ...original, ...updatedFields };
    }
    return null;
  },

  /**
   * Deletes a placement from the database.
   *
   * @async
   * @param {string} id - The ID of the placement to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  deletePlacement: async (id) => {
    await deleteDoc(doc(db, PLACEMENTS_COLLECTION, id));
  },

  /**
   * Signs a student up for a placement.
   * Checks for capacity, duplicate signups, and driver availability rules.
   *
   * @async
   * @param {string} placementId - The ID of the placement.
   * @param {string} studentName - The name of the student.
   * @param {boolean} isDriver - Whether the student is a driver.
   * @param {number} [passengerCapacity=0] - The number of passengers the driver can take (if isDriver is true).
   * @returns {Promise<Object>} A promise that resolves to an object with `success` boolean and `message` string.
   */
  signUp: async (placementId, studentName, isDriver, passengerCapacity = 0) => {
    const placementRef = doc(db, PLACEMENTS_COLLECTION, placementId);
    const placementSnap = await getDoc(placementRef);

    if (!placementSnap.exists()) return { success: false, message: 'Placement not found' };

    const placement = placementSnap.data();
    const signUps = placement.signUps || [];

    if (signUps.length >= placement.capacity) {
      return { success: false, message: 'This placement is full.' };
    }

    const hasDriver = signUps.some(s => s.isDriver);
    if (isDriver && hasDriver) {
      return { success: false, message: 'A driver has already signed up for this placement.' };
    }

    const trimmedName = studentName.trim();
    const isDuplicate = signUps.some(s => s.name.trim().toLowerCase() === trimmedName.toLowerCase());
    if (isDuplicate) {
      return { success: false, message: 'You have already signed up for this placement.' };
    }

    const newSignUps = [...signUps, { name: trimmedName, isDriver, passengerCapacity }];
    await updateDoc(placementRef, { signUps: newSignUps });

    return { success: true, message: 'Successfully signed up!' };
  },

  /**
   * Retrieves notifications for a specific user.
   *
   * @async
   * @param {string} userName - The name of the user to fetch notifications for.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of notification objects.
   */
  getNotifications: async (userName) => {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where("userName", "==", userName) // Note: Case sensitivity might be an issue here compared to original
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Retrieves the most recent notification from the system.
   *
   * @async
   * @returns {Promise<Object|null>} A promise that resolves to the latest notification object, or null if none exist.
   */
  getLatestNotification: async () => {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      orderBy("date", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
  },

  /**
   * Verifies if the provided password matches any of the board passwords.
   *
   * @param {string} password - The password to check.
   * @returns {boolean} True if the password is valid, false otherwise.
   */
  checkBoardPassword: (password) => {
    return password === 'ignatians1929' || password === 'admin' || password === 'board';
  }
};
