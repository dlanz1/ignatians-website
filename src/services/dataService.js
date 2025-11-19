const DATA_KEY = 'ignatians_service_data';

const initialData = {
  placements: [
    {
      id: 1,
      name: 'Boys & Girls Club',
      description: 'Mentoring and activities with children.',
      day: 'Tuesday',
      time: '3:30 PM - 5:30 PM',
      capacity: 4,
      location: 'Venice',
      signUps: []
    },
    {
      id: 2,
      name: 'St. Margaret\'s Center',
      description: 'Food pantry and community assistance.',
      day: 'Wednesday',
      time: '1:00 PM - 4:00 PM',
      capacity: 3,
      location: 'Lennox',
      signUps: []
    },
    {
      id: 3,
      name: 'Midnight Mission',
      description: 'Serving meals to the homeless.',
      day: 'Friday',
      time: '4:00 PM - 7:00 PM',
      capacity: 5,
      location: 'Downtown LA',
      signUps: []
    }
  ],
  notifications: []
};

const loadData = () => {
  const stored = localStorage.getItem(DATA_KEY);
  if (!stored) {
    localStorage.setItem(DATA_KEY, JSON.stringify(initialData));
    return initialData;
  }
  const data = JSON.parse(stored);
  if (!data.notifications) {
    data.notifications = [];
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }
  return data;
};

const saveData = (data) => {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
};

export const dataService = {
  getPlacements: () => {
    return loadData().placements;
  },

  addPlacement: (placement) => {
    const data = loadData();
    const newPlacement = { ...placement, id: Date.now(), signUps: [] };
    data.placements.push(newPlacement);
    saveData(data);
    return newPlacement;
  },

  updatePlacement: (id, updatedFields) => {
    const data = loadData();
    const index = data.placements.findIndex(p => p.id === id);
    if (index !== -1) {
      const original = data.placements[index];
      if (updatedFields.capacity < original.signUps.length) {
        const message = `URGENT: The capacity for "${original.name}" on ${original.day} has been reduced to ${updatedFields.capacity}. Since there are ${original.signUps.length} people signed up, please check with the board to see if you still have a spot.`;

        original.signUps.forEach(student => {
          data.notifications.push({
            id: Date.now() + Math.random(),
            userName: student.name,
            message: message,
            date: new Date().toISOString(),
            read: false
          });
        });
      }

      data.placements[index] = { ...original, ...updatedFields };
      saveData(data);
      return data.placements[index];
    }
    return null;
  },

  deletePlacement: (id) => {
    const data = loadData();
    data.placements = data.placements.filter(p => p.id !== id);
    saveData(data);
  },

  signUp: (placementId, studentName, isDriver) => {
    const data = loadData();
    const placement = data.placements.find(p => p.id === placementId);

    if (!placement) return { success: false, message: 'Placement not found' };

    if (placement.signUps.length >= placement.capacity) {
      return { success: false, message: 'This placement is full.' };
    }

    const hasDriver = placement.signUps.some(s => s.isDriver);
    if (isDriver && hasDriver) {
      return { success: false, message: 'A driver has already signed up for this placement.' };
    }

    const isDuplicate = placement.signUps.some(s => s.name.toLowerCase() === studentName.toLowerCase());
    if (isDuplicate) {
      return { success: false, message: 'You have already signed up for this placement.' };
    }

    placement.signUps.push({ name: studentName, isDriver });
    saveData(data);
    return { success: true, message: 'Successfully signed up!' };
  },

  getNotifications: (userName) => {
    const data = loadData();
    return data.notifications.filter(n => n.userName.toLowerCase() === userName.toLowerCase());
  },

  getLatestNotification: () => {
    const data = loadData();
    if (data.notifications && data.notifications.length > 0) {
      const DATA_KEY = 'ignatians_service_data';

      const initialData = {
        placements: [
          {
            id: 1,
            name: 'Boys & Girls Club',
            description: 'Mentoring and activities with children.',
            day: 'Tuesday',
            time: '3:30 PM - 5:30 PM',
            capacity: 4,
            location: 'Venice',
            signUps: []
          },
          {
            id: 2,
            name: 'St. Margaret\'s Center',
            description: 'Food pantry and community assistance.',
            day: 'Wednesday',
            time: '1:00 PM - 4:00 PM',
            capacity: 3,
            location: 'Lennox',
            signUps: []
          },
          {
            id: 3,
            name: 'Midnight Mission',
            description: 'Serving meals to the homeless.',
            day: 'Friday',
            time: '4:00 PM - 7:00 PM',
            capacity: 5,
            location: 'Downtown LA',
            signUps: []
          }
        ],
        notifications: []
      };

      const loadData = () => {
        const stored = localStorage.getItem(DATA_KEY);
        if (!stored) {
          localStorage.setItem(DATA_KEY, JSON.stringify(initialData));
          return initialData;
        }
        const data = JSON.parse(stored);
        if (!data.notifications) {
          data.notifications = [];
          localStorage.setItem(DATA_KEY, JSON.stringify(data));
        }
        return data;
      };

      const saveData = (data) => {
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
      };

      export const dataService = {
        getPlacements: () => {
          return loadData().placements;
        },

        addPlacement: (placement) => {
          const data = loadData();
          const newPlacement = { ...placement, id: Date.now(), signUps: [] };
          data.placements.push(newPlacement);
          saveData(data);
          return newPlacement;
        },

        updatePlacement: (id, updatedFields) => {
          const data = loadData();
          const index = data.placements.findIndex(p => p.id === id);
          if (index !== -1) {
            const original = data.placements[index];
            if (updatedFields.capacity < original.signUps.length) {
              const message = `URGENT: The capacity for "${original.name}" on ${original.day} has been reduced to ${updatedFields.capacity}. Since there are ${original.signUps.length} people signed up, please check with the board to see if you still have a spot.`;

              original.signUps.forEach(student => {
                data.notifications.push({
                  id: Date.now() + Math.random(),
                  userName: student.name,
                  message: message,
                  date: new Date().toISOString(),
                  read: false
                });
              });
            }

            data.placements[index] = { ...original, ...updatedFields };
            saveData(data);
            return data.placements[index];
          }
          return null;
        },

        deletePlacement: (id) => {
          const data = loadData();
          data.placements = data.placements.filter(p => p.id !== id);
          saveData(data);
        },

        signUp: (placementId, studentName, isDriver) => {
          const data = loadData();
          const placement = data.placements.find(p => p.id === placementId);

          if (!placement) return { success: false, message: 'Placement not found' };

          if (placement.signUps.length >= placement.capacity) {
            return { success: false, message: 'This placement is full.' };
          }

          const hasDriver = placement.signUps.some(s => s.isDriver);
          if (isDriver && hasDriver) {
            return { success: false, message: 'A driver has already signed up for this placement.' };
          }

          const isDuplicate = placement.signUps.some(s => s.name.toLowerCase() === studentName.toLowerCase());
          if (isDuplicate) {
            return { success: false, message: 'You have already signed up for this placement.' };
          }

          placement.signUps.push({ name: studentName, isDriver });
          saveData(data);
          return { success: true, message: 'Successfully signed up!' };
        },

        getNotifications: (userName) => {
          const data = loadData();
          return data.notifications.filter(n => n.userName.toLowerCase() === userName.toLowerCase());
        },

        getLatestNotification: () => {
          const data = loadData();
          if (data.notifications && data.notifications.length > 0) {
            // Sort by date descending and get the first one
            return data.notifications.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          }
          return null;
        },

        checkBoardPassword: (password) => {
          return password === 'ignatians1929' || password === 'admin' || password === 'board';
        },
      };
