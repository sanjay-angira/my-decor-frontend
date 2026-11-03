import { API_ENDPOINTS } from "./api/API_ENDPOINT";
import { deleteData, getData, postData, putData } from "./api/apiService";

export type CustomerAddress = {
  id: number;
  fullName: string;
  phone: string;
  email?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export type CustomerAddressPayload = Omit<CustomerAddress, "id" | "isDefault"> &
  Partial<Pick<CustomerAddress, "isDefault">>;

export function fetchAddresses() {
  return getData<CustomerAddress[]>(API_ENDPOINTS.CUSTOMER.ADDRESSES);
}

export function createAddress(payload: CustomerAddressPayload) {
  return postData<CustomerAddress>(
    API_ENDPOINTS.CUSTOMER.ADDRESSES,
    payload,
  );
}

export function updateAddress(
  id: number,
  payload: Partial<CustomerAddressPayload>,
) {
  return putData<CustomerAddress>(
    API_ENDPOINTS.CUSTOMER.ADDRESS_BY_ID(id),
    payload,
  );
}

export function deleteAddress(id: number) {
  return deleteData(API_ENDPOINTS.CUSTOMER.ADDRESS_BY_ID(id));
}

export function setDefaultAddress(id: number) {
  return putData<CustomerAddress>(
    API_ENDPOINTS.CUSTOMER.ADDRESS_DEFAULT(id),
    {},
  );
}
