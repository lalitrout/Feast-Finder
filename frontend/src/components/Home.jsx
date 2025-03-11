import React from "react";

function Home() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-5 col-sm-12" style={{ marginTop: "9rem" }}>
          <h1>What is FeastFinder?</h1>
          <p className="mt-5">
            💡 “Why pay for food when you can feast for free? FeastFinder helps
            you locate weddings, receptions, and charity events where a glorious
            buffet awaits—no invitation needed! Just confidence, a good
            appetite, and maybe a backup story if someone asks, ‘Who are you
            again?’”
          </p>
        </div>
        <div className="col-1"></div>
        <div className="col-lg-6 col-sm-12" style={{ marginTop: "4rem" }}>
          <img
            src="/Eating donuts-cuate.png"
            alt="eating"
            className="img-fluid w-75 ms-5"
          />
        </div>
        <div className="col-lg-6 col-sm-12 mt-5">
          <img src="/Questions-pana.png" alt="" className="img-fluid w-75" />
        </div>
        <div className="col-1"></div>
        <div className="col-lg-5 col-sm-12" style={{ marginTop: "9rem" }}>
          <h1>How It Works</h1>
          <p className="mt-5">
            🍽️ “See a party? Smell biryani? Hear distant dhol beats? Don’t just
            wonder—share it! Post the event details, and let fellow foodies
            unite. After all, nothing brings people together like free paneer
            butter masala.”
          </p>
        </div>
        <div className="col-lg-5 col-sm-12" style={{ marginTop: "9rem" }}>
          <h1>The Disclaimer</h1>
          <p className="mt-5">
            ⚠️ “Feast responsibly, folks! We don’t provide excuses if you get
            caught—just opportunities. If an uncle at the wedding asks how you
            know the groom, we suggest ‘distant cousin’ or ‘friend from college’
            (even if the groom is 50).”
          </p>
        </div>
        <div className="col-1"></div>
        <div className="col-lg-6 col-sm-12 mt-5">
          <img src="/Charity-bro.png" alt="" className="img-fluid w-75 ms-5" />
        </div>
        <div className="col-lg-6 col-sm-12 mt-5">
          <img src="/Pasta-bro.png" alt="" className="img-fluid w-75" />
        </div>
        <div className="col"></div>
        <div className="col-lg-5 col-sm-12" style={{ marginTop: "9rem" }}>
          <h1>Why Use FeastFinder? </h1>
          <p className="mt-5">
            🥳 “Because life’s too short to say no to free food! Whether you’re
            a hungry bachelor, a broke student, or just someone who loves a good
            buffet, FeastFinder is your golden ticket to unlimited feasting!”
            <br />
            <a href="/signup" style={{textDecoration:"none", color: " #FA5"}}>Do signup &rarr;</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
