import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <Result
        status="404"
        title="Page not found"
        subTitle="The page you are looking for does not exist."
        extra={
          <Button type="primary">
            <Link to="/">Back home</Link>
          </Button>
        }
      />
    </div>
  );
}
