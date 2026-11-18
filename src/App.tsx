import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  Search, MapPin, BedDouble, Bath, Heart, ShieldCheck, ArrowRight,
  Menu, X, Home, Building2, UserRound, LayoutDashboard, Plus, Bell,
  MessageCircle, CreditCard, CheckCircle2, Clock3, ChevronRight,
  SlidersHorizontal, LogOut, Camera, Wallet, FileText, CircleHelp,
  BadgeCheck, LockKeyhole, Filter, Eye, ArrowLeft, Send, House
} from "lucide-react";
import { initialProperties, money, type Property } from "./data";

type Page = "home" | "explore" | "property" | "dashboard" | "add" | "admin" | "how";
type Role = "Tenant" | "Landlord" | "Admin";

const readStore = <T,>(key: string, fallback: T): T => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback; }
  catch { return fallback; }
};

export default function App() {
  const [properties, setProperties] = useState<Property[]>(() => readStore("chq_properties", initialProperties));
  const [page, setPage] = useState<Page>("home");
  const [selected, setSelected] = useState<Property | null>(null);
  const [role, setRole] = useState<Role>("Tenant");
  const [userName, setUserName] = useState("Demo User");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All locations");
  const [type, setType] = useState("Any property type");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("Any");
  const [favourites, setFavourites] = useState<string[]>(() => readStore("chq_favourites", []));
  const [enquiries, setEnquiries] = useState<string[]>(() => readStore("chq_enquiries", []));
  const [notice, setNotice] = useState("");
  const [paymentProperty, setPaymentProperty] = useState<Property | null>(null);
  const [paymentProvider, setPaymentProvider] = useState("Paystack");
  const [paymentMode, setPaymentMode] = useState<"demo" | "live">("demo");
  const [showPayment, setShowPayment] = useState(false);
  const [form, setForm] = useState({ title: "", city: "Ibadan", area: "", type: "Apartment", beds: "2", baths: "2", price: "", description: "", image: "" });

  const saveProperties = (next: Property[]) => {
    setProperties(next); localStorage.setItem("chq_properties", JSON.stringify(next));
  };
  const flash = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 3600); };
  const toggleFavourite = (id: string) => {
    const next = favourites.includes(id) ? favourites.filter(x => x !== id) : [...favourites, id];
    setFavourites(next); localStorage.setItem("chq_favourites", JSON.stringify(next));
  };
  const filtered = useMemo(() => properties.filter(p => {
    const q = query.toLowerCase();
    return (!q || `${p.title} ${p.city} ${p.area} ${p.type}`.toLowerCase().includes(q))
      && (city === "All locations" || p.city === city)
      && (type === "Any property type" || p.type === type)
      && (!maxPrice || p.price <= Number(maxPrice))
      && (bedrooms === "Any" || p.beds >= Number(bedrooms))
      && p.status === "Available";
  }), [properties, query, city, type, maxPrice, bedrooms]);

  const openProperty = (p: Property) => { setSelected(p); setPage("property"); window.scrollTo(0,0); };
  const go = (p: Page) => { setPage(p); setMobileOpen(false); window.scrollTo(0,0); };
  const startPayment = (p: Property) => { setPaymentProperty(p); setShowPayment(true); };
  const sendEnquiry = (p: Property) => {
    if (!enquiries.includes(p.id)) {
      const next = [...enquiries, p.id]; setEnquiries(next); localStorage.setItem("chq_enquiries", JSON.stringify(next));
    }
    flash("Your enquiry has been recorded in this demo.");
  };
  const addListing = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.area || !form.price) { flash("Please complete the required fields."); return; }
    const p: Property = {
      id: `CHQ-${Date.now().toString().slice(-6)}`, title: form.title, city: form.city, area: form.area,
      type: form.type, beds: Number(form.beds), baths: Number(form.baths), price: Number(form.price),
      frequency: "year", image: form.image || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
      images: [form.image || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"],
      verified: false, featured: false, description: form.description || "New demonstration listing.",
      amenities: ["Water supply", "Parking"], landlord: userName, agencyFee: 0, agreementFee: 0, cautionFee: 0, status: "Available"
    };
    saveProperties([p, ...properties]); setForm({ title: "", city: "Ibadan", area: "", type: "Apartment", beds: "2", baths: "2", price: "", description: "", image: "" });
    flash("Listing added. It is pending verification."); go("dashboard");
  };
  const finishDemoPayment = () => {
    if (!paymentProperty) return;
    const record = { ref: `CHQ-DEMO-${Date.now()}`, property: paymentProperty.title, amount: paymentProperty.price + paymentProperty.agencyFee + paymentProperty.agreementFee + paymentProperty.cautionFee, provider: paymentProvider, status: "SIMULATED — NOT A REAL PAYMENT", date: new Date().toLocaleString() };
    const history = readStore<any[]>("chq_payments", []);
    localStorage.setItem("chq_payments", JSON.stringify([record, ...history]));
    setShowPayment(false); setPaymentProperty(null);
    flash("Demo payment recorded. No real money was charged.");
    go("dashboard");
  };

  const total = (p: Property) => p.price + p.agencyFee + p.agreementFee + p.cautionFee;

  return <div className="app-shell">
    {notice && <div className="toast" role="status"><CheckCircle2 size={18}/>{notice}</div>}
    <header className="topbar">
      <div className="nav-inner">
        <button className="brand" onClick={() => go("home")} aria-label="CompoundHQ home">
          <span className="brand-mark"><House size={22}/></span><span>compound<span className="brand-light">HQ</span></span>
        </button>
        <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
          <button className={page==="home"?"active":""} onClick={()=>go("home")}>Home</button>
          <button className={page==="explore"?"active":""} onClick={()=>go("explore")}>Explore properties</button>
          <button className={page==="how"?"active":""} onClick={()=>go("how")}>How it works</button>
          <button onClick={()=>go("dashboard")}>Dashboard</button>
        </nav>
        <div className="nav-actions">
          <select className="role-select" value={role} onChange={e=>{setRole(e.target.value as Role); flash(`Demo view switched to ${e.target.value}.`);}}>
            <option>Tenant</option><option>Landlord</option><option>Admin</option>
          </select>
          <button className="avatar" onClick={()=>go(role==="Admin"?"admin":"dashboard")} title="Open dashboard"><UserRound size={18}/></button>
          <button className="mobile-toggle" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen?<X/>:<Menu/>}</button>
        </div>
      </div>
    </header>

    {page==="home" && <main>
      <section className="hero">
        <div className="hero-image"></div><div className="hero-shade"></div>
        <div className="hero-content wrap">
          <div className="eyebrow light"><span></span> A BETTER WAY TO RENT</div>
          <h1>Find your space.<br/><em>Secure your place.</em></h1>
          <p>Discover homes with clearer pricing, more confidence and a simpler path from search to move-in.</p>
          <div className="hero-buttons"><button className="btn btn-green" onClick={()=>go("explore")}>Explore properties <ArrowRight size={17}/></button><button className="btn btn-glass" onClick={()=>go("how")}>How CompoundHQ works</button></div>
        </div>
        <div className="search-panel wrap">
          <div className="search-field"><MapPin/><label>Location</label><select value={city} onChange={e=>setCity(e.target.value)}><option>All locations</option><option>Ibadan</option><option>Lagos</option><option>Abuja</option></select></div>
          <div className="search-field"><Building2/><label>Property type</label><select value={type} onChange={e=>setType(e.target.value)}><option>Any property type</option><option>Apartment</option><option>Mini flat</option><option>Terrace</option><option>Detached house</option><option>Self-contained</option></select></div>
          <div className="search-field"><Wallet/><label>Maximum budget (₦)</label><input value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="e.g. 2,000,000" inputMode="numeric"/></div>
          <button className="btn btn-navy search-submit" onClick={()=>go("explore")}><Search size={18}/> Search homes</button>
        </div>
      </section>

      <section className="trust-strip"><div className="wrap trust-items"><div><ShieldCheck/><span><b>Verification-led</b><small>More confidence in listings</small></span></div><div><FileText/><span><b>Clearer costs</b><small>Know the charges upfront</small></span></div><div><CreditCard/><span><b>Digital payments</b><small>Payment-ready experience</small></span></div><div><MessageCircle/><span><b>Direct enquiries</b><small>Connect with listing owners</small></span></div></div></section>

      <section className="section wrap">
        <div className="section-heading"><div><div className="eyebrow">FIND YOUR NEXT ADDRESS</div><h2>Homes worth coming home to.</h2><p>Explore selected properties from our demonstration marketplace.</p></div><button className="text-link" onClick={()=>go("explore")}>View all properties <ArrowRight size={16}/></button></div>
        <div className="property-grid">{properties.filter(p=>p.featured && p.status==="Available").slice(0,3).map(p=><PropertyCard key={p.id} p={p} fav={favourites.includes(p.id)} onFav={()=>toggleFavourite(p.id)} onOpen={()=>openProperty(p)}/>)}</div>
      </section>

      <section className="split-section"><div className="split-image"></div><div className="split-copy"><div className="eyebrow">THE COMPOUNDHQ DIFFERENCE</div><h2>Renting should feel like a fresh start. Not a guessing game.</h2><p>We are building a more transparent rental experience: discover properties, understand the costs, connect with listing representatives and keep your rental journey organised.</p><button className="btn btn-navy" onClick={()=>go("how")}>Discover how it works <ArrowRight size={17}/></button></div></section>

      <section className="section wrap"><div className="cta-band"><div><div className="eyebrow light">PROPERTY OWNERS & MANAGERS</div><h2>Your property deserves the right audience.</h2><p>Create a listing and connect with people searching for their next home.</p></div><button className="btn btn-white" onClick={()=>{setRole("Landlord");go("add");}}>List a property <ArrowRight size={17}/></button></div></section>
    </main>}

    {page==="explore" && <main className="wrap page-main">
      <div className="page-title"><div><div className="eyebrow">PROPERTY MARKETPLACE</div><h1>Explore properties</h1><p>Find a place that fits your needs and budget.</p></div><span className="demo-pill">DEMO LISTINGS</span></div>
      <div className="filter-bar"><div className="filter-search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by area, city or property name"/></div><select value={city} onChange={e=>setCity(e.target.value)}><option>All locations</option><option>Ibadan</option><option>Lagos</option><option>Abuja</option></select><select value={type} onChange={e=>setType(e.target.value)}><option>Any property type</option><option>Apartment</option><option>Mini flat</option><option>Terrace</option><option>Detached house</option><option>Self-contained</option></select><input className="budget-filter" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="Max budget ₦" inputMode="numeric"/><select value={bedrooms} onChange={e=>setBedrooms(e.target.value)}><option value="Any">Any beds</option><option value="1">1+ beds</option><option value="2">2+ beds</option><option value="3">3+ beds</option><option value="4">4+ beds</option></select><button className="btn btn-outline" onClick={()=>{setQuery("");setCity("All locations");setType("Any property type");setMaxPrice("");setBedrooms("Any");}}><Filter size={16}/> Reset</button></div>
      <div className="results-line"><b>{filtered.length} properties found</b><span>Prices shown in Nigerian naira (₦)</span></div>
      {filtered.length ? <div className="property-grid">{filtered.map(p=><PropertyCard key={p.id} p={p} fav={favourites.includes(p.id)} onFav={()=>toggleFavourite(p.id)} onOpen={()=>openProperty(p)}/>)}</div> : <div className="empty-state"><House size={34}/><h3>No matching properties</h3><p>Try adjusting your search or filters.</p></div>}
    </main>}

    {page==="property" && selected && <main className="wrap page-main">
      <button className="back-link" onClick={()=>go("explore")}><ArrowLeft size={17}/> Back to properties</button>
      <div className="detail-layout"><div className="detail-main">
        <div className="detail-photo"><img src={selected.image} alt={selected.title}/><span className="photo-tag">Property photos · Demo</span></div>
        <div className="detail-heading"><div><div className="eyebrow">{selected.type.toUpperCase()} · {selected.id}</div><h1>{selected.title}</h1><p><MapPin size={16}/>{selected.area}, {selected.city}, Nigeria</p></div>{selected.verified?<span className="verified"><BadgeCheck size={16}/> Verification demo</span>:<span className="pending"><Clock3 size={15}/> Not verified</span>}</div>
        <div className="spec-row"><span><BedDouble/>{selected.beds} Bedrooms</span><span><Bath/>{selected.baths} Bathrooms</span><span><Building2/>{selected.type}</span></div>
        <div className="detail-section"><h3>About this property</h3><p>{selected.description}</p></div>
        <div className="detail-section"><h3>Property features</h3><div className="amenities">{selected.amenities.map(a=><span key={a}><CheckCircle2 size={15}/>{a}</span>)}</div></div>
        <div className="detail-section landlord-box"><div className="landlord-avatar"><Building2/></div><div><small>LISTED BY</small><b>{selected.landlord}</b><p>Demonstration landlord profile</p></div><span className="demo-pill">DEMO PROFILE</span></div>
      </div><aside className="price-card"><small>RENTAL PRICE</small><div className="price-large">{money(selected.price)}</div><p>per year · Subject to landlord confirmation</p><div className="cost-list"><div><span>Annual rent</span><b>{money(selected.price)}</b></div><div><span>Agency fee</span><b>{money(selected.agencyFee)}</b></div><div><span>Agreement fee</span><b>{money(selected.agreementFee)}</b></div><div><span>Caution deposit</span><b>{money(selected.cautionFee)}</b></div><div className="cost-total"><span>Illustrative total</span><b>{money(total(selected))}</b></div></div><p className="fine-print">This is an indicative breakdown using demonstration data. Confirm all charges with the property owner before making any payment.</p><button className="btn btn-green full" onClick={()=>sendEnquiry(selected)}><MessageCircle size={17}/> Send an enquiry</button><button className="btn btn-navy full" onClick={()=>startPayment(selected)}><CreditCard size={17}/> Explore payment checkout</button><button className="save-detail" onClick={()=>toggleFavourite(selected.id)}><Heart size={17} fill={favourites.includes(selected.id)?"currentColor":"none"}/>{favourites.includes(selected.id)?"Saved to favourites":"Save property"}</button></aside></div>
    </main>}

    {page==="how" && <main className="wrap page-main"><div className="page-title"><div><div className="eyebrow">A CLEARER RENTAL JOURNEY</div><h1>How CompoundHQ works</h1><p>One platform designed to bring more clarity to the rental process.</p></div></div><div className="steps-grid">{[{n:"01",icon:<Search/>,t:"Discover",d:"Search properties by location, type, bedrooms and budget. Review photos, details and disclosed charges."},{n:"02",icon:<ShieldCheck/>,t:"Build confidence",d:"Review landlord and property verification indicators. Verification status is clearly displayed."},{n:"03",icon:<MessageCircle/>,t:"Connect",d:"Send an enquiry and communicate with the listing representative to confirm availability and terms."},{n:"04",icon:<CreditCard/>,t:"Pay with clarity",d:"Review the agreed amount and use an available payment method when the transaction is supported."}].map(s=><div className="step-card" key={s.n}><span className="step-number">{s.n}</span><div className="step-icon">{s.icon}</div><h3>{s.t}</h3><p>{s.d}</p></div>)}</div><div className="notice-panel"><ShieldCheck/><div><b>Trust is a process, not just a badge.</b><p>CompoundHQ's intended verification process requires appropriate identity and property-authority checks. Sample badges in this prototype are demonstration data and are not proof of real-world verification.</p></div></div></main>}

    {page==="dashboard" && <main className="wrap page-main">
      <div className="page-title"><div><div className="eyebrow">{role.toUpperCase()} WORKSPACE</div><h1>Welcome, {userName}</h1><p>Your CompoundHQ activity at a glance.</p></div><button className="btn btn-green" onClick={()=>go(role==="Landlord"?"add":"explore")}>{role==="Landlord"?<><Plus size={17}/> Add property</>:<>Explore homes <ArrowRight size={17}/></>}</button></div>
      <div className="stat-grid"><Stat icon={<Heart/>} label="Saved properties" value={String(favourites.length)}/><Stat icon={<MessageCircle/>} label="Enquiries sent" value={String(enquiries.length)}/><Stat icon={<CreditCard/>} label="Demo transactions" value={String(readStore<any[]>("chq_payments",[]).length)}/><Stat icon={<Home/>} label="Available listings" value={String(properties.filter(p=>p.status==="Available").length)}/></div>
      {role==="Landlord" && <div className="dashboard-section"><div className="section-heading"><div><h2>Your property listings</h2><p>Manage your demonstration listings.</p></div><button className="btn btn-outline" onClick={()=>go("add")}><Plus size={16}/> Add listing</button></div><div className="table-wrap"><table><thead><tr><th>Property</th><th>Location</th><th>Annual rent</th><th>Verification</th><th>Status</th></tr></thead><tbody>{properties.filter(p=>p.landlord===userName || p.landlord==="Adebayo Properties").map(p=><tr key={p.id}><td>{p.title}</td><td>{p.area}, {p.city}</td><td>{money(p.price)}</td><td>{p.verified?"Demo verified":"Pending"}</td><td>{p.status}</td></tr>)}</tbody></table></div></div>}
      <div className="dashboard-columns"><div className="dashboard-section"><h2>Saved properties</h2>{properties.filter(p=>favourites.includes(p.id)).length?properties.filter(p=>favourites.includes(p.id)).map(p=><button className="mini-row" key={p.id} onClick={()=>openProperty(p)}><img src={p.image}/><span><b>{p.title}</b><small>{p.area}, {p.city}</small></span><ChevronRight/></button>):<div className="small-empty">Properties you save will appear here.</div>}</div><div className="dashboard-section"><h2>Recent enquiries</h2>{enquiries.length?enquiries.map(id=>{const p=properties.find(x=>x.id===id);return p?<div className="enquiry-row" key={id}><MessageCircle/><span><b>{p.title}</b><small>Enquiry recorded · Demo</small></span><span className="status-chip">Sent</span></div>:null;}):<div className="small-empty">Your property enquiries will appear here.</div>}</div></div>
      <div className="dashboard-section"><h2>Payment history</h2><PaymentHistory/></div>
    </main>}

    {page==="add" && <main className="wrap page-main narrow"><button className="back-link" onClick={()=>go("dashboard")}><ArrowLeft size={17}/> Dashboard</button><div className="page-title"><div><div className="eyebrow">LANDLORD TOOLS</div><h1>Create a property listing</h1><p>Add the basic details for your property. New listings are unverified by default.</p></div></div><form className="form-card" onSubmit={addListing}><div className="form-grid"><label className="field wide">Property title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Modern 2-bedroom apartment"/></label><label className="field">City<select value={form.city} onChange={e=>setForm({...form,city:e.target.value})}><option>Ibadan</option><option>Lagos</option><option>Abuja</option><option>Abeokuta</option><option>Port Harcourt</option></select></label><label className="field">Area / neighbourhood<input required value={form.area} onChange={e=>setForm({...form,area:e.target.value})} placeholder="e.g. Bodija"/></label><label className="field">Property type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Apartment</option><option>Mini flat</option><option>Self-contained</option><option>Terrace</option><option>Detached house</option></select></label><label className="field">Annual rent (₦)<input required type="number" min="1" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="1800000"/></label><label className="field">Bedrooms<input type="number" min="0" value={form.beds} onChange={e=>setForm({...form,beds:e.target.value})}/></label><label className="field">Bathrooms<input type="number" min="0" value={form.baths} onChange={e=>setForm({...form,baths:e.target.value})}/></label><label className="field wide">Image URL (optional)<input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..."/></label><label className="field wide">Description<textarea rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the property, amenities and nearby facilities."/></label></div><div className="notice-panel"><ShieldCheck/><div><b>Verification comes after submission.</b><p>Your listing will appear as unverified until the platform's review process is completed.</p></div></div><button className="btn btn-green full" type="submit">Submit listing <ArrowRight size={17}/></button></form></main>}

    {page==="admin" && <main className="wrap page-main"><div className="page-title"><div><div className="eyebrow">PLATFORM CONTROL CENTRE</div><h1>Admin overview</h1><p>Prototype administration view. Production access must be protected by server-side roles.</p></div><span className="demo-pill">DEMO ADMIN</span></div><div className="stat-grid"><Stat icon={<UserRound/>} label="Sample users" value="128"/><Stat icon={<Home/>} label="Property listings" value={String(properties.length)}/><Stat icon={<ShieldCheck/>} label="Demo verified listings" value={String(properties.filter(p=>p.verified).length)}/><Stat icon={<Bell/>} label="Pending review" value={String(properties.filter(p=>!p.verified).length)}/></div><div className="dashboard-section"><h2>Property review queue</h2><div className="table-wrap"><table><thead><tr><th>Listing</th><th>Location</th><th>Listed by</th><th>Current status</th><th>Admin action</th></tr></thead><tbody>{properties.map(p=><tr key={p.id}><td>{p.title}</td><td>{p.area}, {p.city}</td><td>{p.landlord}</td><td>{p.verified?"Demo verified":"Unverified"}</td><td><button className="table-action" onClick={()=>{const next=properties.map(x=>x.id===p.id?{...x,verified:true}:x);saveProperties(next);flash("Demo listing status updated. This is not a real verification.");}}>Mark demo verified</button></td></tr>)}</tbody></table></div></div></main>}

    <footer className="footer"><div className="wrap footer-main"><div><button className="brand footer-brand" onClick={()=>go("home")}><span className="brand-mark"><House size={22}/></span><span>compound<span className="brand-light">HQ</span></span></button><p>Find your space. Secure your place.<br/>A more transparent rental journey.</p></div><div><b>Explore</b><button onClick={()=>go("explore")}>Properties</button><button onClick={()=>go("how")}>How it works</button></div><div><b>For property owners</b><button onClick={()=>{setRole("Landlord");go("add");}}>List a property</button><button onClick={()=>{setRole("Landlord");go("dashboard");}}>Landlord dashboard</button></div><div><b>Platform</b><button onClick={()=>go("admin")}>Admin demo</button><button onClick={()=>flash("Contact: hello@compoundhq.example (placeholder)")}>Contact</button></div></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} CompoundHQ. Prototype demonstration.</span><span>Sample listings and payment records are illustrative.</span></div></footer>

    {showPayment && paymentProperty && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowPayment(false);}}><div className="payment-modal"><button className="modal-close" onClick={()=>setShowPayment(false)}><X/></button><div className="modal-icon"><LockKeyhole/></div><div className="eyebrow">SECURE CHECKOUT CONCEPT</div><h2>Rental payment</h2><p className="modal-sub">{paymentProperty.title} · {paymentProperty.area}, {paymentProperty.city}</p><div className="checkout-total"><span>Illustrative total</span><b>{money(total(paymentProperty))}</b></div><label className="field">Payment provider<select value={paymentProvider} onChange={e=>setPaymentProvider(e.target.value)}><option>Paystack</option><option>Flutterwave</option></select></label><label className="field">Checkout mode<select value={paymentMode} onChange={e=>setPaymentMode(e.target.value as "demo"|"live")}><option value="demo">Demonstration mode</option><option value="live">Live integration (not configured)</option></select></label>{paymentMode==="live"?<div className="warning-box">Live checkout is not connected in this frontend demo. Configure the secure backend endpoints and provider credentials before accepting real payments.</div>:<div className="notice-panel compact"><CheckCircle2/><div><b>Demo checkout</b><p>No money will be charged. This creates a clearly labelled simulated transaction record.</p></div></div>}<button className="btn btn-green full" disabled={paymentMode==="live"} onClick={finishDemoPayment}>Simulate {paymentProvider} payment <ArrowRight size={17}/></button><p className="fine-print center">Never transfer money based solely on a demo listing or demonstration checkout.</p></div></div>}
  </div>;
}

function PropertyCard({p,fav,onFav,onOpen}:{p:Property;fav:boolean;onFav:()=>void;onOpen:()=>void}) {
  return <article className="property-card"><div className="card-image" onClick={onOpen} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onOpen()}><img src={p.image} alt={p.title}/><span className="card-type">{p.type}</span><button className={`fav-btn ${fav?"selected":""}`} onClick={e=>{e.stopPropagation();onFav();}} aria-label="Save property"><Heart size={18} fill={fav?"currentColor":"none"}/></button></div><div className="card-body"><div className="card-location"><MapPin size={14}/>{p.area}, {p.city}</div><h3 onClick={onOpen}>{p.title}</h3><div className="card-specs"><span><BedDouble size={15}/>{p.beds} beds</span><span><Bath size={15}/>{p.baths} baths</span><span>{p.verified?<><ShieldCheck size={15} className="green-icon"/> Demo verified</>:<><Clock3 size={15}/> Unverified</>}</span></div><div className="card-bottom"><div><b>{money(p.price)}</b><small>/ year</small></div><button className="circle-arrow" onClick={onOpen} aria-label="View property"><ArrowRight size={18}/></button></div></div></article>;
}
function Stat({icon,label,value}:{icon:ReactNode;label:string;value:string}) { return <div className="stat-card"><span className="stat-icon">{icon}</span><div><small>{label}</small><b>{value}</b></div></div>; }
function PaymentHistory() {
  const records = readStore<any[]>("chq_payments", []);
  return records.length ? <div className="table-wrap"><table><thead><tr><th>Reference</th><th>Property</th><th>Provider</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>{records.map((r,i)=><tr key={i}><td>{r.ref}</td><td>{r.property}</td><td>{r.provider}</td><td>{money(r.amount)}</td><td><span className="status-chip warning">{r.status}</span></td><td>{r.date}</td></tr>)}</tbody></table></div>:<div className="small-empty">No transactions yet. Try the demonstration checkout on a property page.</div>;
}
