import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export default function PartnerSignupSuccessPage() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <Result
        status="success"
        title="Application submitted"
        subTitle="Thanks — we’ve received your partner sign-up. You’ll also get a confirmation email."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back to home
          </Button>
        }
      />
    </div>
  );
}
