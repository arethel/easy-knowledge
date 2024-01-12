
export const fetchLogout = async (client, navigate) => {
  try {
    const response = await client.post('users/auth/logout/');

    if (response.status === 200) {
      navigate('/sign-in');
    } else {
      console.error('Failed to logout');
      alert('Failed to logout');
    }
  } catch (error) {
    console.error('Error during logout', error);
    alert('Error during logout');
  }

  return null;
};