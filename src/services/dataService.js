const DATA_KEY = 'ignatians_service_data';

const initialData = {
  placements: [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
      id: 7,
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
  }
};
