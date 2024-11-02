import React, { useState, useEffect } from "react";

function Offline({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: `${window.innerHeight}px`,
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

  if (!isOnline) {
    return (
      <div style={styles.container}>
        <div style={styles.box}>Please connect to the internet</div>
      </div>
    );
  }

  return <> {children} </>;
}

export default Offline;
