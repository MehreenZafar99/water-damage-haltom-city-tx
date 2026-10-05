"use client";

import { useEffect } from "react";
import siteConfig from "../../site.config";
import { NEIGHBORHOOD_PROBLEMS } from "@/lib/site-data";
import { BigCall, FaqAccordion, SiteFooter } from "./Shared";

const HOME_FAQS = [
  {
    question: "How fast can you get here?",
    answer:
      "In most cases a crew arrives within 60 minutes anywhere in Haltom City, day or night.",
  },
  {
    question: "Do I call my insurance company first?",
    answer:
      "No. Stop the water and call us so drying starts right away. Then open your claim. Waiting can make the damage worse and weaken your claim.",
  },
  {
    question: "How long will the drying take?",
    answer:
      "Most properties dry in three to five days. Concrete slabs and hardwood can take a little longer.",
  },
  {
    question: "Can I stay in my home?",
    answer:
      "Usually yes. If sewage or heavy mold is involved, we may ask you to stay out of that area until it is cleaned.",
  },
  {
    question: "Is the inspection free?",
    answer: "Yes. The on site assessment costs nothing.",
  },
  {
    question: "Do you also do the repairs?",
    answer:
      "Yes. Once everything is dry we replace drywall, flooring, texture, paint and trim.",
  },
];

const TRIAGE = [
  {
    id: "t1",
    label: "Burst Pipe",
    title: "A pipe just burst",
    lead: "Hundreds of gallons can come out in an hour. Act fast:",
    steps: [
      "Shut off the main valve at the meter box or in the garage.",
      "Turn off breakers for wet rooms if you can reach them without standing in water.",
      "Open a faucet to drain what is left in the lines.",
      "Move rugs and electronics off the floor.",
    ],
    note: "We extract the water, find where it went inside walls and dry everything.",
    more: { href: "/services/burst-pipe-water-damage/", label: "Burst pipe water damage" },
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 12h7m4 0h7M10 9v6m4-6v6" stroke="#0f2a44" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "t2",
    label: "Ceiling Leak",
    title: "Water is coming through the ceiling",
    lead: "This is often a roof leak, an attic AC line or an attic water heater.",
    steps: [
      "Keep everyone out from under any sagging area.",
      "Put a bucket under drips and cover furniture.",
      "Turn off the AC if it runs through the attic.",
      "Do not poke a bulging ceiling yourself.",
    ],
    note: "We relieve trapped water safely, dry the attic and repair the ceiling.",
    more: { href: "/services/ceiling-water-damage-repair/", label: "Ceiling water damage repair" },
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 6h18M7 6v3m10-3v3M12 12c0 0-3 3.5-3 5.5a3 3 0 0 0 6 0C15 15.5 12 12 12 12Z" stroke="#0f2a44" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "t3",
    label: "Flooding",
    title: "Storm or creek water got inside",
    lead: "Outside flood water carries soil and bacteria, so it needs more than drying.",
    steps: [
      "Stay out of the water and avoid touching it without boots and gloves.",
      "Do not use electricity in flooded rooms.",
      "Take photos of the water line for insurance.",
      "Keep children and pets away.",
    ],
    note: "We pump out the water, remove what cannot be saved, disinfect and dry.",
    more: { href: "/services/flood-damage-restoration/", label: "Flood damage restoration" },
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M2 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M6 11V5l6-3 6 3v6" stroke="#0f2a44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "t4",
    label: "Sewage Backup",
    title: "Sewage is backing up",
    lead: "This is contaminated water. Do not clean it up with a mop and bleach.",
    steps: [
      "Stop flushing toilets and running water in the home.",
      "Keep people and pets out of the area.",
      "Turn off the HVAC if it pulls air from that room.",
      "Throw away any food the water touched.",
    ],
    note: "Our crew uses protective gear, removes the waste and disinfects every surface.",
    more: { href: "/services/sewage-backup-cleanup/", label: "Sewage backup cleanup" },
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="#0f2a44" strokeWidth="2" />
        <path d="M8 12h8M12 8v8" stroke="#0f2a44" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "t5",
    label: "Wet Floors",
    title: "Floors are wet and you are not sure why",
    lead: "In Haltom City this is often a slab leak, an appliance leak or rain water at the foundation.",
    steps: [
      "Check the dishwasher, washer, water heater and fridge line.",
      "Feel for warm spots on the floor, a sign of a hot water slab leak.",
      "Turn off all water and watch the meter for 30 minutes.",
      "Pull up wet rugs so the floor can breathe.",
    ],
    note: "Thermal cameras and moisture meters show where the water is coming from.",
    more: { href: "/services/slab-leak-water-damage/", label: "Slab leak water damage" },
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M2 18h20M5 18V9l7-5 7 5v9M9 14h6" stroke="#0f2a44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "t6",
    label: "Musty Smell",
    title: "There is a musty smell or dark spots",
    lead: "That usually means hidden moisture, and possibly mold.",
    steps: [
      "Do not scrub or spray large patches of mold.",
      "Look under sinks, around the AC and along exterior walls.",
      "Run a fan or dehumidifier in the room for now.",
      "Note when the smell is worst.",
    ],
    note: "We find the moisture source, then contain and remove the mold properly.",
    more: { href: "/services/mold-remediation/", label: "Mold remediation" },
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="9" r="2" stroke="#0f2a44" strokeWidth="2" />
        <circle cx="15" cy="14" r="3" stroke="#0f2a44" strokeWidth="2" />
        <circle cx="16" cy="6" r="1.5" stroke="#0f2a44" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const phone = siteConfig.phoneDisplay;
  const tel = siteConfig.phoneTel;

  useEffect(() => {
    const faqs = Array.from(document.querySelectorAll<HTMLDetailsElement>(".qa details"));
    const onToggle = (e: Event) => {
      const d = e.currentTarget as HTMLDetailsElement;
      if (!d.open) return;
      faqs.forEach((o) => {
        if (o !== d) o.open = false;
      });
    };
    faqs.forEach((d) => d.addEventListener("toggle", onToggle));
    return () => faqs.forEach((d) => d.removeEventListener("toggle", onToggle));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="hero-tag">
              <span className="dot" aria-hidden="true" /> Crews on call now &middot; Open 24/7
            </span>
            <h1>
              Water Damage Restoration in <em>Haltom City, TX</em>
            </h1>
            <p className="hero-lead">
              Burst pipe, flooded floor or a dripping ceiling? A local crew can be at your door in about 60 minutes to stop the water, dry your property and repair the damage.
            </p>
            <div className="hero-call">
              <a className="hero-phone" href={`tel:${tel}`}>
                <span className="ring" aria-hidden="true">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" stroke="#0f2a44" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  <small>Tap to call now</small>
                  <b>{phone}</b>
                </span>
              </a>
              <p>A real person answers, day or night.</p>
            </div>
            <ul className="hero-proof">
              <li>Free on site assessment</li>
              <li>IICRC trained technicians</li>
              <li>We work with your insurance</li>
            </ul>
          </div>
          <div className="hero-card" aria-label="Service details">
            <div className="hc-top">
              <span>Haltom City Service Desk</span>
              <b className="green">Available</b>
            </div>
            <div className="hc-row"><span>Typical arrival</span><b>~60 minutes</b></div>
            <div className="hc-row"><span>Hours</span><b>24 hours, 7 days</b></div>
            <div className="hc-row"><span>Inspection</span><b>Free</b></div>
            <div className="hc-row"><span>Insurance</span><b>Direct billing</b></div>
            <div className="hc-row"><span>Coverage</span><b>All 14 neighborhoods</b></div>
            <a className="btn-phone hc-btn" href={`tel:${tel}`}>Call {phone}</a>
          </div>
        </div>
      </section>

      <section className="triage" id="first-steps">
        <div className="wrap">
          <span className="kicker">First steps</span>
          <h2 className="triage-h">What is happening at your property right now?</h2>
          <p className="lead">Pick what you see to get the first steps to take before our crew arrives.</p>
          <div className="triage-tabs">
            {TRIAGE.map((t, i) => (
              <input
                key={`radio-${t.id}`}
                className="triage-radio"
                type="radio"
                name="triage-tab"
                id={`tab-${t.id}`}
                defaultChecked={i === 0}
              />
            ))}
            <div className="picker" role="tablist" aria-label="Choose your water problem">
              {TRIAGE.map((t) => (
                <label key={t.id} className="pick" htmlFor={`tab-${t.id}`} id={t.id}>
                  {t.icon}
                  {t.label}
                </label>
              ))}
            </div>
            <div className="panels">
              {TRIAGE.map((t) => (
                <article
                  className={`panel panel-${t.id}`}
                  key={t.id}
                  role="tabpanel"
                  aria-labelledby={t.id}
                >
                  <div>
                    <h3>{t.title}</h3>
                    <p>{t.lead}</p>
                    <ol>
                      {t.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="side">
                    <a className="btn-phone" href={`tel:${tel}`}>
                      Call {phone}
                    </a>
                    <p>{t.note}</p>
                    <a className="more" href={t.more.href}>
                      {t.more.label} &rarr;
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="clock">
        <div className="wrap">
          <div className="clock-head">
            <div>
              <span className="kicker">The water clock</span>
              <h2>What water does to a Haltom City home, hour by hour</h2>
            </div>
            <p>The sooner drying starts, the more of your home can be saved instead of torn out.</p>
          </div>
          <div className="track">
            <article className="now"><span>Minute 0</span><b>You call</b><p>Crew dispatched. Most of your floors and walls can still be saved.</p></article>
            <article><span>Hours 1 to 6</span><b>Water spreads</b><p>It soaks carpet pad, runs under baseboards and wicks up drywall.</p></article>
            <article><span>Hours 6 to 24</span><b>Materials swell</b><p>Drywall softens, laminate edges lift, furniture legs stain.</p></article>
            <article><span>Hours 24 to 48</span><b>Mold can start</b><p>Musty odor begins. Warm Texas air speeds this up.</p></article>
            <article><span>Day 3 and on</span><b>Costs climb</b><p>Hardwood cups, subfloors weaken and mold spreads inside walls.</p></article>
          </div>
        </div>
      </section>

      <section className="local">
        <div className="wrap local-grid">
          <div>
            <span className="kicker">Only Haltom City</span>
            <h2>We know how water hurts homes here</h2>
            <p>Most Haltom City homes are several decades old and sit on slab foundations over North Texas clay. That clay swells when wet and shrinks in drought, which strains pipes under and inside the slab.</p>
            <p>Add spring hail, hard freezes like February 2021 and runoff near Big Fossil Creek and Little Fossil Creek, and each neighborhood tends to have its own common problem.</p>
            <div className="facts">
              <div className="fact"><b>1950s</b><span>to 1980s: when most homes here were built</span></div>
              <div className="fact"><b>14</b><span>neighborhoods covered, all inside city limits</span></div>
              <div className="fact"><b>60 min</b><span>typical arrival anywhere in Haltom City</span></div>
            </div>
          </div>
          <div className="hoods">
              {NEIGHBORHOOD_PROBLEMS.map((n) => (
                <article className="hood-card" key={n.slug}>
                  <a href={n.slug}>{n.name}</a>
                  <p>{n.problem}</p>
                </article>
              ))}
            </div>
        </div>
      </section>

      <div className="interrupt">
        <div className="wrap">
          <p>Water still spreading? Shut the main valve and call.</p>
          <a className="btn-phone" href={`tel:${tel}`}>Call {phone}</a>
        </div>
      </div>

      <section className="log">
        <div className="wrap">
          <span className="kicker">What a typical job looks like</span>
          <h2>From the first call to the last coat of paint</h2>
          <p>Every job gets a written log with photos and moisture readings, so you and your adjuster can see exactly what was done.</p>
          <div className="entries">
            <article className="entry">
              <span className="when">Day 1</span><span className="stamp">Arrival within ~60 min</span>
              <h3>Stop, extract and map</h3>
              <ul>
                <li>Safety check and water source stopped</li>
                <li>Standing water extracted</li>
                <li>Thermal scan of walls, floors and ceilings</li>
                <li>Drying equipment set up</li>
                <li>Before photos taken</li>
              </ul>
            </article>
            <article className="entry">
              <span className="when">Days 2 to 4</span><span className="stamp">Daily visits</span>
              <h3>Dry and monitor</h3>
              <ul>
                <li>Moisture readings logged each day</li>
                <li>Equipment moved and adjusted</li>
                <li>Mold checks on wet materials</li>
                <li>Updates shared with your insurer</li>
              </ul>
            </article>
            <article className="entry">
              <span className="when">Day 5 and on</span><span className="stamp">Once readings are dry</span>
              <h3>Restore</h3>
              <ul>
                <li>Final dry readings confirmed</li>
                <li>Drywall, texture and paint</li>
                <li>Flooring and trim replaced</li>
                <li>Final walkthrough with you</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="ins">
        <div className="wrap">
          <span className="kicker">Before you call your insurer</span>
          <h2>Will insurance pay for it?</h2>
          <div className="ins-grid">
            <div className="ins-col yes">
              <h3>Usually covered</h3>
              <ul>
                <li>Burst or frozen pipes</li>
                <li>Water heater or washer failure</li>
                <li>A broken supply line under a sink</li>
                <li>Roof leaks caused by a storm</li>
              </ul>
            </div>
            <div className="ins-col no">
              <h3>Often not covered</h3>
              <ul>
                <li>Slow leaks that went on for months</li>
                <li>Outside flood water without flood insurance</li>
                <li>Damage from lack of maintenance</li>
              </ul>
            </div>
            <div className="ins-col">
              <h3>What we do for your claim</h3>
              <ul>
                <li>Photos and daily moisture logs</li>
                <li>Itemized estimate insurers accept</li>
                <li>Meet your adjuster on site</li>
                <li>Direct billing with most carriers</li>
              </ul>
            </div>
          </div>
          <p className="note">
            Every policy is different and your insurer makes the final call.{" "}
            <a className="link-u" href="/insurance-claims-help/">Full insurance claims guide</a>
          </p>
        </div>
      </section>

      <section className="calls">
        <div className="wrap calls-grid">
          <aside>
            <span className="kicker">Real questions</span>
            <h2>What people ask us on the phone</h2>
            <p>These come up on almost every call from Haltom City. Have a different one? Just ask.</p>
            <a className="btn-phone" href={`tel:${tel}`}>Call {phone}</a>
          </aside>
          <div>
            <FaqAccordion faqs={HOME_FAQS} />
            <a className="link-u" href="/faq/">See all answers</a>
          </div>
        </div>
      </section>

      <section className="dir">
        <div className="wrap">
          <span className="kicker">All 16 services</span>
          <h2>Every water damage service we offer in Haltom City</h2>
          <div className="dir-grid">
            <article className="dir-card">
              <h3>Emergency</h3>
              <ul>
                <li><a href="/services/emergency-water-damage-restoration/">Emergency Restoration</a></li>
                <li><a href="/services/water-extraction/">Water Extraction</a></li>
                <li><a href="/services/structural-drying-dehumidification/">Structural Drying</a></li>
                <li><a href="/services/water-damage-inspection-moisture-detection/">Moisture Detection</a></li>
              </ul>
            </article>
            <article className="dir-card">
              <h3>By Water Source</h3>
              <ul>
                <li><a href="/services/burst-pipe-water-damage/">Burst Pipes</a></li>
                <li><a href="/services/slab-leak-water-damage/">Slab Leaks</a></li>
                <li><a href="/services/appliance-leak-water-damage/">Appliance Leaks</a></li>
                <li><a href="/services/roof-leak-water-damage/">Roof Leaks</a></li>
                <li><a href="/services/flood-damage-restoration/">Flood Damage</a></li>
                <li><a href="/services/storm-damage-restoration/">Storm Damage</a></li>
                <li><a href="/services/sewage-backup-cleanup/">Sewage Backup</a></li>
              </ul>
            </article>
            <article className="dir-card">
              <h3>By Area</h3>
              <ul>
                <li><a href="/services/ceiling-water-damage-repair/">Ceilings</a></li>
                <li><a href="/services/carpet-flooring-water-damage/">Carpet and Flooring</a></li>
                <li><a href="/services/drywall-water-damage-repair/">Drywall</a></li>
                <li><a href="/services/basement-crawl-space-water-damage/">Crawl Spaces</a></li>
              </ul>
            </article>
            <article className="dir-card">
              <h3>After the Water</h3>
              <ul>
                <li><a href="/services/mold-remediation/">Mold Remediation</a></li>
                <li><a href="/insurance-claims-help/">Insurance Claims Help</a></li>
                <li><a href="/about-us/">About Our Crew</a></li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <BigCall />
      <SiteFooter />
    </>
  );
}
