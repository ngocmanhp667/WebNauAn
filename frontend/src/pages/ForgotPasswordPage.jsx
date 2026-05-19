import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import FormMessage from "../components/FormMessage";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import { forgotPasswordApi } from "../services/authApi";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const targetEmail = email.trim();
      const result = await forgotPasswordApi(targetEmail);
      setStatus({
        tone: "success",
        title:
          result?.message ||
          "Da gui OTP. Hay kiem tra email de tiep tuc dat lai mat khau.",
      });
      setEmail("");
      if (targetEmail) {
        navigate(`/reset-password?email=${encodeURIComponent(targetEmail)}`);
      }
    } catch (error) {
      setStatus({
        tone: "error",
        title: error?.message || "Khong the gui yeu cau dat lai mat khau.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Quen mat khau"
      subtitle="Nhap email de nhan ma OTP dat lai mat khau."
      footer={
        <p className="text-xs text-ink-700/70">
          Da co OTP?{" "}
          <Link
            className="font-semibold text-sea-700"
            to={
              email
                ? `/reset-password?email=${encodeURIComponent(email)}`
                : "/reset-password"
            }
          >
            Chuyen sang dat lai mat khau.
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
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        {status ? (
          <FormMessage tone={status.tone} title={status.title} />
        ) : null}

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Dang gui OTP..." : "Gui OTP"}
        </PrimaryButton>
      </form>
    </AuthShell>
  );
};

export default ForgotPasswordPage;
