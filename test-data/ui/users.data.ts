export const USERS = {
  existingUser: {
    username: 'aosauto010',
    email: 'aosauto010@test.com',
    password: 'Test1234',
    shipping: {
      primary: {
        city: 'New York',
        address: 'Good Place',
      },
      alternate: {
        city: 'Boston',
        address: '45 Test Street',
      },
    },
  },
  paymentPersistenceUser: {
    username: 'aosauto011',
    email: 'aosauto011@test.com',
    password: 'Test1234',
    shipping: {
      primary: {
        city: 'New York',
        address: 'Good Place',
      },
      alternate: {
        city: 'Boston',
        address: '45 Test Street',
      },
    },
  },
} as const;

export const generateUniqueUser = () => {
  const uniqueId = Date.now().toString().slice(-8);

  return {
    username: `aos${uniqueId}`,
    email: `aos${uniqueId}@test.com`,
    password: 'Test1234',
  };
};
