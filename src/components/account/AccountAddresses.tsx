"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
  type CustomerAddress,
  type CustomerAddressPayload,
} from "@/services/addressService";

const emptyAddress: CustomerAddressPayload = {
  label: "Home",
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

function requestError(error: unknown): string {
  return error instanceof Error ? error.message : "Address request failed.";
}

export function AccountAddresses() {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CustomerAddressPayload>(emptyAddress);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    void fetchAddresses()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message || "Addresses could not be loaded.");
        }
        if (active) {
          setAddresses(response.data);
          setError("");
        }
      })
      .catch((loadError: unknown) => {
        if (active) setError(requestError(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  function startCreate() {
    setEditingId(null);
    setForm({ ...emptyAddress, isDefault: addresses.length === 0 });
    setNotice("");
    setError("");
    setFormOpen(true);
  }

  function startEdit(address: CustomerAddress) {
    setEditingId(address.id);
    setForm({
      label: address.label ?? "",
      fullName: address.fullName,
      phone: address.phone,
      email: address.email ?? "",
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });
    setNotice("");
    setError("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyAddress);
  }

  async function submitAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload: CustomerAddressPayload = {
      ...form,
      label: form.label?.trim() || null,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email?.trim() || null,
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2?.trim() || null,
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
    };

    try {
      const response = editingId
        ? await updateAddress(editingId, payload)
        : await createAddress(payload);
      if (!response.success) {
        throw new Error(response.message || "Address could not be saved.");
      }

      setAddresses((current) => {
        const updated = editingId
          ? current.map((address) =>
              address.id === editingId ? response.data : address,
            )
          : [...current, response.data];
        if (response.data.isDefault) {
          return updated.map((address) => ({
            ...address,
            isDefault: address.id === response.data.id,
          }));
        }
        return updated;
      });
      setFormOpen(false);
      setEditingId(null);
      setForm(emptyAddress);
      setNotice(editingId ? "Address updated." : "Address added.");
    } catch (saveError) {
      setError(requestError(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function makeDefault(address: CustomerAddress) {
    setPendingId(address.id);
    setError("");
    setNotice("");
    try {
      const response = await setDefaultAddress(address.id);
      if (!response.success) {
        throw new Error(response.message || "Default address could not be updated.");
      }
      setAddresses((current) =>
        current.map((item) => ({
          ...item,
          isDefault: item.id === address.id,
        })),
      );
      setNotice("Default address updated.");
    } catch (defaultError) {
      setError(requestError(defaultError));
    } finally {
      setPendingId(null);
    }
  }

  async function removeAddress(address: CustomerAddress) {
    setPendingId(address.id);
    setError("");
    setNotice("");
    try {
      const response = await deleteAddress(address.id);
      if (!response.success) {
        throw new Error(response.message || "Address could not be deleted.");
      }
      setAddresses((current) => current.filter((item) => item.id !== address.id));
      setNotice("Address deleted.");
    } catch (deleteError) {
      setError(requestError(deleteError));
    } finally {
      setPendingId(null);
    }
  }

  const updateField = (field: keyof CustomerAddressPayload, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Saved addresses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the delivery addresses saved to your account.
          </p>
        </div>
        {!formOpen && (
          <button type="button" className="button button-brand" onClick={startCreate}>
            Add address
          </button>
        )}
      </div>

      {error && (
        <p className="mt-5 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-5 rounded-lg bg-brand-soft px-4 py-3 text-sm text-foreground" role="status">
          {notice}
        </p>
      )}

      {formOpen && (
        <form
          className="mt-6 rounded-lg border border-border p-4 sm:p-5"
          onSubmit={submitAddress}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-foreground">
              {editingId ? "Edit address" : "Add a new address"}
            </h3>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
              aria-label="Close address form"
              disabled={saving}
              onClick={closeForm}
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              Address label
              <select
                value={form.label ?? ""}
                onChange={(event) => updateField("label", event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
              >
                <option value="">Other</option>
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Relative">Relative</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              Recipient name
              <input
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              Phone number
              <input
                required
                minLength={10}
                maxLength={15}
                autoComplete="tel"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              Email (optional)
              <input
                type="email"
                autoComplete="email"
                value={form.email ?? ""}
                onChange={(event) => updateField("email", event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground sm:col-span-2">
              Address
              <input
                required
                minLength={5}
                maxLength={255}
                autoComplete="address-line1"
                value={form.addressLine1}
                onChange={(event) => updateField("addressLine1", event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground sm:col-span-2">
              Apartment, suite, landmark (optional)
              <input
                maxLength={255}
                autoComplete="address-line2"
                value={form.addressLine2 ?? ""}
                onChange={(event) => updateField("addressLine2", event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              City
              <input
                required
                minLength={2}
                maxLength={100}
                autoComplete="address-level2"
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              State
              <input
                required
                minLength={2}
                maxLength={100}
                autoComplete="address-level1"
                value={form.state}
                onChange={(event) => updateField("state", event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-foreground">
              PIN code
              <input
                required
                minLength={6}
                maxLength={12}
                autoComplete="postal-code"
                value={form.pincode}
                onChange={(event) => updateField("pincode", event.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2.5 font-normal outline-none focus:border-brand"
              />
            </label>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={Boolean(form.isDefault)}
              onChange={(event) => updateField("isDefault", event.target.checked)}
              className="h-4 w-4 accent-[var(--brand)]"
            />
            Set as default address
          </label>

          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" className="button button-brand" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save changes" : "Save address"}
            </button>
            <button
              type="button"
              className="button button-brand-outline"
              disabled={saving}
              onClick={closeForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground" role="status">Loading addresses…</p>
      ) : error && addresses.length === 0 && !formOpen ? (
        <div className="mt-6 rounded-lg border border-border p-6 text-center">
          <p className="text-sm text-destructive" role="alert">{error}</p>
          <button
            type="button"
            className="button button-brand-outline mt-4"
            onClick={() => {
              setLoading(true);
              setError("");
              setReloadKey((key) => key + 1);
            }}
          >
            Try again
          </button>
        </div>
      ) : addresses.length === 0 && !formOpen ? (
        <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
          <Icon name="pin" className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold text-foreground">No saved addresses</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a delivery address to make checkout easier.
          </p>
          <button type="button" className="button button-brand mt-5" onClick={startCreate}>
            Add address
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-foreground">{address.fullName}</h3>
                  {address.label && (
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                      {address.label}
                    </span>
                  )}
                  {address.isDefault && (
                    <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                <br />
                {address.city}, {address.state} {address.pincode}
              </p>
              <p className="mt-2 text-sm text-foreground">{address.phone}</p>
              {address.email && (
                <p className="mt-1 break-all text-sm text-muted-foreground">{address.email}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-3 border-t border-border pt-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-brand hover:underline"
                  disabled={pendingId !== null}
                  onClick={() => startEdit(address)}
                >
                  Edit
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    className="text-sm font-semibold text-brand hover:underline"
                    disabled={pendingId !== null}
                    onClick={() => void makeDefault(address)}
                  >
                    {pendingId === address.id ? "Updating…" : "Set as default"}
                  </button>
                )}
                <button
                  type="button"
                  className="text-sm font-semibold text-destructive hover:underline"
                  disabled={pendingId !== null}
                  onClick={() => void removeAddress(address)}
                >
                  {pendingId === address.id ? "Updating…" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
