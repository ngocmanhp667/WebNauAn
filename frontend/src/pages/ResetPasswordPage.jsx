import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import FormMessage from "../components/FormMessage";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { resetPasswordApi } from "../services/authApi";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const [form, setForm] = useState({
    email: emailParam,
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const passwordMismatch = useMemo(() => {
    return form.confirmPassword && form.newPassword !== form.confirmPassword;
  }, [form.confirmPassword, form.newPassword]);

  useEffect(() => {
    if (emailParam && !form.email) {
      setForm((prev) => ({
        ...prev,
        email: emailParam,
      }));
    }
  }, [emailParam, form.email]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (status) {
      setStatus(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (passwordMismatch) {
      setStatus({
        tone: "error",
        title: "Mat khau xac nhan chua trung khop.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const result = await resetPasswordApi(
        form.email,
        form.otp,
        form.newPassword,
        form.confirmPassword,
      );
      setStatus({
        tone: "success",
        title: result?.message || "Dat lai mat khau thanh cong.",
      });
      setForm({
        email: "",
        otp: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setStatus({
        tone: "error",
        title: error?.message || "Khong the dat lai mat khau.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Dat lai mat khau"
      subtitle="Nhap OTP va mat khau moi de hoan tat khoi phuc."
      footer={
        <p className="text-xs text-ink-700/70">
          OTP co hieu luc 10 phut.{" "}
          <Link className="font-semibold text-sea-700" to="/forgot-password">
            Gui lai OTP.
          </Link>
        </p>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="ban@mamngon.vn"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <InputField
          label="OTP"
          name="otp"
          type="text"
          placeholder="Ma 6 chu so"
          autoComplete="one-time-code"
          value={form.otp}
          onChange={handleChange}
          required
        />
        <InputField
          label="Mat khau moi"
          name="newPassword"
          type="password"
          placeholder="Mat khau moi"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={handleChange}
          required
        />
        <InputField
          label="Xac nhan mat khau"
          name="confirmPassword"
          type="password"
          placeholder="Nhap lai mat khau"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={passwordMismatch ? "Mat khau chua trung khop." : ""}
          required
        />

        {status ? (
          <FormMessage tone={status.tone} title={status.title} />
        ) : null}

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Dang cap nhat..." : "Dat lai mat khau"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
};

export default ResetPasswordPage;
