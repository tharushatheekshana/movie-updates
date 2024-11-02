import { useEffect, useState } from "react";

function Mobile({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice =
      userAgent.includes("mobile") || userAgent.includes("android");
    setIsMobile(isMobileDevice);

    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: `${height}px`,
      backgroundColor: "#333",
    },
    box: {
      padding: "20px 40px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      color: "#000",
      fontSize: "18px",
      margin: "30px",
    },
  };

  if (isMobile) {
    return (
      <div style={styles.container}>
        <div style={styles.box}>
          This website is not available on mobile devices
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default Mobile;
