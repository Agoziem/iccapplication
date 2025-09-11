export const validateUser = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/authapi/getuser/${id}/`
  );
  const data = await res.json();
  return data;
};

export const fetchOAuthUserData = async (provider, profile) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/authapi/register_oauth/${provider}/`,
    {
      method: "POST",
      body: JSON.stringify(profile),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(
      "An error occurred while trying to verify user credentials"
    );
  }

  return await response.json();
};

export const authorizeCredentials = async (credentials) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL}/authapi/verifyuser/`,
      {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(
        "An error occurred while trying to verify user credentials"
      );
    }

    const userdata = await response.json();
    return userdata.user;
  } catch (error) {
    console.error("error:", error);
    return null;
  }
};

const mapOAuthUserData = (userData, token) => {
  const {
    id,
    username,
    first_name,
    last_name,
    email,
    is_staff,
    date_joined,
    isOauth,
    emailIsVerified,
    twofactorIsEnabled,
    Sex: sex,
    phone,
    address,
    avatar_name,
    avatar_url,
  } = userData;

  Object.assign(token, {
    id,
    username,
    first_name,
    last_name,
    email,
    is_staff,
    date_joined,
    isOauth,
    emailIsVerified,
    twofactorIsEnabled,
    sex,
    phone,
    address,
    avatar_name,
    avatar_url,
  });
};

const mapNonOAuthUserData = (userData, token) => {
  const {
    id,
    username,
    first_name,
    last_name,
    avatar_url,
    email,
    is_staff,
    date_joined,
    isOauth,
    emailIsVerified,
    twofactorIsEnabled,
    Sex: sex,
    phone,
    address,
    avatar,
    avatar_name,
  } = userData;

  Object.assign(token, {
    id,
    username,
    first_name,
    last_name,
    picture: avatar_url,
    email,
    is_staff,
    date_joined,
    isOauth,
    emailIsVerified,
    twofactorIsEnabled,
    sex,
    phone,
    address,
    avatar,
    avatar_name,
    avatar_url,
  });
};

export { mapOAuthUserData, mapNonOAuthUserData };
