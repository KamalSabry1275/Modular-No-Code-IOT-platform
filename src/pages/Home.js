import "react-toastify/dist/ReactToastify.css";
import QRCode from "qrcode.react";
import { CitySvg } from "../components/CitySvg";

function Home() {
  const members = [
    { track: "frontend", name: "kamal sabry" },
    { track: "backend", name: "fathy mohamed" },
    { track: "hardware", name: "poula george" },
    { track: "hardware", name: "islam ibrahim" },
    { track: "ai", name: "kareem Adel" },
    { track: "ai", name: "Ahmed Abdelhamed" },
    { track: "mobile", name: "Kerolos Emad" },
    { track: "mobile", name: "Nadia khaled" },
  ];

  return (
    <>
      <div className="container">
        <div className="home">
          <section>
            <h1>IOT Platform</h1>
            <p>
              {/* The project is focused on creating an IoT platform for smart
              homes, allowing users to choose modules and configure pin settings
              on a microcontroller. Once the project setup is saved, it connects
              with the microcontroller via WebSocket for signal transmission and
              control, enabling users to manage their smart home devices
              seamlessly. */}
              A modular no-code IoT platform empowers users to create and manage
              IoT solutions without the need for programming skills. By
              leveraging a user-friendly interface with drag-and-drop
              capabilities, it simplifies the process of connecting and
              controlling smart devices. This approach fosters rapid prototyping
              and deployment, making IoT technology accessible to a broader
              audience, including non-technical users. The platform's modular
              nature ensures flexibility and scalability, enabling users to
              customize and expand their IoT systems as needed.
            </p>
            <CitySvg />
          </section>
          <section>
            <h1>Members</h1>
            <div className="member-card">
              {members?.map((member, i) => {
                return (
                  <div key={i} className="card">
                    <span></span>
                    <span></span>
                    <div className="card-title">
                      <h2>{member.track}</h2>
                      <hr />
                      <h3>{member.name}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <footer>
            <div className="inf">
              {/* <p>download my application from scan</p>
              <QRCode
                value="google.com"
                level="H"
                bgColor="transparent"
                renderAs="svg"
              /> */}
            </div>
            <div className="copy">© 2024 Copyright: Kamal Sabry</div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default Home;
