// src/profile/profile.service.js

import api from "../utils/axios";

/*
  Get Profile
*/
export const getProfile = async (set) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const res = await api.get(
      "/auth/getProfile"
    );

    set({
      userProfile: res.data.data,
      loading: false,
    });

    return res.data.data;
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch profile",
    });
  }
};

/*
  Update Profile
*/
export const updateProfile = async (
  set,
  payload
) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const formData = new FormData();

    formData.append("name", payload.name);
    formData.append("phone", payload.phone);

    if (payload.avatar) {
      formData.append(
        "avatar",
        payload.avatar
      );
    }

    const res = await api.patch(
      "/auth/updateProfile",
      formData
    );

    set({
      userProfile: res.data.data,
      loading: false,
    });

    return res.data.data;
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to update profile",
    });
  }
};

/*
  Create Address
*/
export const createAddress = async (
  set,
  payload
) => {
  try {
    set({
      loading: true,
      error: null,
    });

    await api.post(
      "/address/createAddress",
      payload
    );

    await fetchAddresses(set);
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to create address",
    });
  }
};

/*
  Fetch Addresses
*/
export const fetchAddresses = async (set) => {
  try {
    set({
      loading: true,
      error: null,
    });

    const res = await api.get(
      "/address/getAddresses"
    );

    set({
      addresses: res.data.data,
      loading: false,
    });
    console.log(res);
    
    return res.data.data;
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to fetch addresses",
    });
  }
};

/*
  Update Address
*/
export const updateAddress = async (
  set,
  addressId,
  payload
) => {
  try {
    set({
      loading: true,
      error: null,
    });

    await api.patch(
      `/address/updateAddress/${addressId}`,
      payload
    );

    await fetchAddresses(set);
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to update address",
    });
  }
};

/*
  Delete Address
*/
export const deleteAddress = async (
  set,
  addressId
) => {
  try {
    set({
      loading: true,
      error: null,
    });

    await api.delete(
      `/address/deleteAddress/${addressId}`
    );

    await fetchAddresses(set);
  } catch (error) {
    set({
      loading: false,
      error:
        error.response?.data?.message ||
        "Failed to delete address",
    });
  }
};