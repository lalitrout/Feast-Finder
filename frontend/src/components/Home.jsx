import React, { useState } from "react";

function Home() {
  const isLoggedIn = !!localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const handleLinkClick = (href) => {
    setLoading(true);
    setTimeout(() => {
      window.location.href = href;
    }, 500); // Adjust if needed
  };

  return (
    <div className="container py-5 position-relative">
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            zIndex: 9999,
          }}
        >
          <div className="spinner-border text-warning" role="status"></div>
        </div>
      )}

      {/* Section 1 - What is FeastFinder */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6 col-sm-12 mb-4 mb-lg-0">
          <h1 className="fw-bold text-orange">What is FeastFinder?</h1>
          <p className="mt-4 fs-5 text-secondary ">
            💡 “Why pay for food when you can feast for free? FeastFinder helps
            you locate weddings, receptions, and charity events where a glorious
            buffet awaits—no invitation needed! Just confidence, a good appetite,
            and maybe a backup story if someone asks, ‘Who are you again?’”
          </p>
          <div className="mt-3">
            {!isLoggedIn && (
              <button
                className="btn btn-outline-warning me-3"
                onClick={() => handleLinkClick("/login")}
              >
                Login &rarr;
              </button>
            )}
            <button
              className="btn btn-outline-warning"
              onClick={() => handleLinkClick("/eventslist")}
            >
              Upcoming Events &rarr;
            </button>
          </div>
        </div>
        <div className="col-lg-6 col-sm-12 text-center">
          <img
            src="/Eating donuts-cuate.png"
            alt="People enjoying food"
            className="img-fluid w-75"
          />
        </div>
      </div>

      {/* Section 2 - How it works */}
      <div className="row align-items-center mb-5 flex-lg-row-reverse">
        <div className="col-lg-6 col-sm-12 mb-4 mb-lg-0 text-center">
          <img
            src="/Questions-pana.png"
            alt="How it works illustration"
            className="img-fluid w-75"
          />
        </div>
        <div className="col-lg-6 col-sm-12">
          <h1 className="fw-bold text-orange">How It Works</h1>
          <p className="mt-4 fs-5 text-secondary">
            🍽️ “See a party? Smell biryani? Hear distant dhol beats? Don’t just
            wonder—share it! Post the event details, and let fellow foodies
            unite. After all, nothing brings people together like free paneer
            butter masala.”
          </p>
          <button
            className="btn btn-outline-warning mt-3"
            onClick={() => handleLinkClick("/eventslist")}
          >
            Explore Events &rarr;
          </button>
        </div>
      </div>

      {/* Section 3 - Disclaimer */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6 col-sm-12 mb-4 mb-lg-0">
          <h1 className="fw-bold text-orange">The Disclaimer</h1>
          <p className="mt-4 fs-5 text-secondary">
            ⚠️ “Feast responsibly, folks! We don’t provide excuses if you get
            caught—just opportunities. If an uncle at the wedding asks how you
            know the groom, we suggest ‘distant cousin’ or ‘friend from college’
            (even if the groom is 50).”
          </p>
          <button
            className="btn btn-outline-warning mt-3"
            onClick={() => handleLinkClick("/about")}
          >
            Read More &rarr;
          </button>
        </div>
        <div className="col-lg-6 col-sm-12 text-center">
          <img
            src="/Charity-bro.png"
            alt="Charity event"
            className="img-fluid w-75"
          />
        </div>
      </div>

      {/* Section 4 - Why Use FeastFinder */}
      <div className="row align-items-center mb-5 flex-lg-row-reverse">
        <div className="col-lg-6 col-sm-12 mb-4 mb-lg-0 text-center">
          <img
            src="/Pasta-bro.png"
            alt="Feasting illustration"
            className="img-fluid w-75"
          />
        </div>
        <div className="col-lg-6 col-sm-12">
          <h1 className="fw-bold text-orange">Why Use FeastFinder?</h1>
          <p className="mt-4 fs-5 text-secondary">
            🥳 “Because life’s too short to say no to free food! Whether you’re a
            hungry bachelor, a broke student, or just someone who loves a good
            buffet, FeastFinder is your golden ticket to unlimited feasting!”
          </p>
          {!isLoggedIn && (
            <button
              className="btn btn-outline-warning mt-3"
              onClick={() => handleLinkClick("/login")}
            >
              Login Now &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
