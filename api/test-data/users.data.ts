export const API_USERS = {
  existingUser: {
    username: 'aosauto010',
    email: 'aosauto010@test.com',
    password: 'Test1234',
  },
} as const;

export const generateUniqueApiUser = () => {
  const uniqueId = Date.now().toString().slice(-8);

  return {
    accountType: 'USER' as const,
    address: '',
    allowOffersPromotion: true,
    aobUser: false,
    cityName: '',
    country: 'UNITED_STATES_US' as const,
    email: `aos${uniqueId}@test.com`,
    firstName: '',
    lastName: '',
    loginName: `aos${uniqueId}`,
    password: 'Test1234',
    phoneNumber: '',
    stateProvince: '',
    zipcode: '',
  };
};

export const generateInvalidApiUser = () => {
  const uniqueId = Date.now().toString().slice(-8);

  return {
    username: `invalid${uniqueId}`,
    email: `invalid${uniqueId}@test.com`,
    password: 'Invalid1234',
  };
};
