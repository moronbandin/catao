import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, Coffee, Instagram, Mail, MapPin, Menu, Minus, Plus, Search, ShoppingBag, Star, Trash2, X } from "lucide-react";
import "./styles.css";

const coffees = [
  { id: "lomba", name: "Lomba", country: "Etiopía", region: "Guji · Shakiso", process: "Natural", roast: "Filtro", notes: ["amorodo", "xasmín", "cacao"], price: 16.5, score: "88", color: "#e96d46", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85", description: "Un café floral e sedoso que lembra os primeiros amorodos da tempada. Tostado con mimo para revelar toda a súa dozura." },
  { id: "serra", name: "Serra", country: "Colombia", region: "Huila · Palestina", process: "Lavado", roast: "Omniroast", notes: ["panela", "ameixa", "avelá"], price: 14.5, score: "86.5", color: "#d7a13d", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=85", description: "Equilibrado, limpo e doce. Un café amable para todos os días, brillante en filtro e redondo en espresso." },
  { id: "bruma", name: "Bruma", country: "Guatemala", region: "Huehuetenango", process: "Lavado", roast: "Espresso", notes: ["chocolate", "laranxa", "caramelo"], price: 13.9, score: "85.5", color: "#708f88", image: "https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1200&q=85", description: "Denso e reconfortante, con acidez cítrica e un final longo a chocolate. A nosa elección para espresso." },
  { id: "ribeira", name: "Ribeira", country: "Brasil", region: "Minas Gerais", process: "Natural", roast: "Espresso", notes: ["noces", "cacao", "mel"], price: 12.5, score: "84.5", color: "#ae6847", image: "https://images.unsplash.com/photo-1442550528053-c431ecb55509?auto=format&fit=crop&w=1200&q=85", description: "Corpo cremoso, dozura de mel e baixa acidez. Un espresso clásico elevado por unha materia prima excepcional." }
];

const posts = [
  { title: "Como facer un V60 que saiba a gloria", tag: "Receitas", date: "28.05.2026", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=85" },
  { title: "Da cereixa á cunca: que é o proceso natural?", tag: "Aprender", date: "15.05.2026", image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=1000&q=85" },
  { title: "Visitamos a colleita en Huila", tag: "Orixes", date: "02.05.2026", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=85" }
];

const text = {
  gl: { shop: "Cafés", sub: "Subscricións", business: "Empresas", about: "Nós", journal: "Diario", contact: "Contacto", cart: "Cesta", add: "Engadir á cesta", all: "Ver todos os cafés" },
  es: { shop: "Cafés", sub: "Suscripciones", business: "Empresas", about: "Nosotros", journal: "Diario", contact: "Contacto", cart: "Cesta", add: "Añadir a la cesta", all: "Ver todos los cafés" },
  en: { shop: "Coffee", sub: "Subscriptions", business: "Wholesale", about: "About", journal: "Journal", contact: "Contact", cart: "Cart", add: "Add to cart", all: "Shop all coffee" }
};

const AppContext = createContext();
const useApp = () => useContext(AppContext);

function AppProvider({ children }) {
  const [lang, setLang] = useState("gl");
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("catao-cart") || "[]"));
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => localStorage.setItem("catao-cart", JSON.stringify(cart)), [cart]);
  const add = (coffee, qty = 1) => {
    setCart(items => items.some(i => i.id === coffee.id) ? items.map(i => i.id === coffee.id ? { ...i, qty: i.qty + qty } : i) : [...items, { ...coffee, qty }]);
    setCartOpen(true);
  };
  const update = (id, qty) => setCart(items => qty < 1 ? items.filter(i => i.id !== id) : items.map(i => i.id === id ? { ...i, qty } : i));
  const value = useMemo(() => ({ lang, setLang, t: text[lang], cart, add, update, cartOpen, setCartOpen }), [lang, cart, cartOpen]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function Header() {
  const { t, lang, setLang, cart, setCartOpen } = useApp();
  const [open, setOpen] = useState(false);
  const links = [["/cafes", t.shop], ["/subscricions", t.sub], ["/empresas", t.business], ["/sobre", t.about], ["/diario", t.journal]];
  return <header className="header">
    <Link className="logo" to="/" onClick={() => setOpen(false)}>CATAO<span>®</span></Link>
    <nav className={open ? "nav open" : "nav"}>
      {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}
      <NavLink to="/contacto" onClick={() => setOpen(false)}>{t.contact}</NavLink>
    </nav>
    <div className="header-actions">
      <label className="language"><span className="sr-only">Idioma</span><select value={lang} onChange={e => setLang(e.target.value)}><option value="gl">GL</option><option value="es">ES</option><option value="en">EN</option></select><ChevronDown size={12}/></label>
      <button className="bag" onClick={() => setCartOpen(true)} aria-label={t.cart}><ShoppingBag size={19}/><b>{cart.reduce((n, i) => n + i.qty, 0)}</b></button>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Menú">{open ? <X/> : <Menu/>}</button>
    </div>
  </header>;
}

function Cart() {
  const { cart, update, cartOpen, setCartOpen, t } = useApp();
  const total = cart.reduce((n, i) => n + i.price * i.qty, 0);
  return <>
    <div className={cartOpen ? "scrim visible" : "scrim"} onClick={() => setCartOpen(false)}/>
    <aside className={cartOpen ? "cart open" : "cart"}>
      <div className="cart-head"><h2>{t.cart}</h2><button onClick={() => setCartOpen(false)}><X/></button></div>
      <div className="cart-body">
        {!cart.length && <div className="empty"><Coffee size={42}/><p>A túa cesta está baleira.</p><Link to="/cafes" onClick={() => setCartOpen(false)}>Descubrir cafés</Link></div>}
        {cart.map(item => <div className="cart-item" key={item.id}>
          <div className="cart-swatch" style={{background:item.color}}><span>{item.name[0]}</span></div>
          <div><h4>{item.name}</h4><small>250 g · en gran</small><div className="qty"><button onClick={() => update(item.id, item.qty-1)}><Minus/></button><span>{item.qty}</span><button onClick={() => update(item.id, item.qty+1)}><Plus/></button></div></div>
          <div className="cart-price">{(item.price * item.qty).toFixed(2)} €<button onClick={() => update(item.id, 0)}><Trash2 size={15}/></button></div>
        </div>)}
      </div>
      {!!cart.length && <div className="cart-foot"><div><span>Subtotal</span><strong>{total.toFixed(2)} €</strong></div><small>Envío calculado no seguinte paso.</small><button onClick={() => alert("Demo de checkout: conecta aquí a túa pasarela de pagamentos.")}>Ir ao pagamento <ArrowRight/></button></div>}
    </aside>
  </>;
}

const ButtonLink = ({to, children, light=false}) => <Link className={light ? "btn light" : "btn"} to={to}>{children}<ArrowRight size={17}/></Link>;

function Home() {
  const { t } = useApp();
  return <main>
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow">Tostado amodo en Galicia</span><h1>Café con<br/><em>sentidiño.</em></h1><p>Cafés extraordinarios, tratados con respecto desde a orixe ata a túa cunca.</p><ButtonLink to="/cafes" light>{t.all}</ButtonLink></div>
      <div className="hero-art"><div className="sun"/><div className="pack pack-a">CATAO<small>LOMBA<br/>ETIOPÍA</small></div><div className="pack pack-b">CATAO<small>SERRA<br/>COLOMBIA</small></div><div className="stamp">TOSTADO<br/>EN GALICIA</div></div>
      <span className="vertical">CAFÉ DE ESPECIALIDADE · DESDE 2022</span>
    </section>
    <section className="marquee"><div>CAFÉ BO · XENTE BOA · SEN PRESAS · CAFÉ BO · XENTE BOA · SEN PRESAS · </div></section>
    <section className="intro section"><span className="eyebrow green">A nosa maneira</span><h2>Buscamos cafés que contan historias. Tostámolos para que poidas saborealas.</h2><p>Traballamos con produtores e importadores que comparten a nosa teima pola calidade, a trazabilidade e unhas relacións xustas.</p><ButtonLink to="/sobre">Coñece CATAO</ButtonLink></section>
    <Featured />
    <section className="split-story">
      <div className="story-image"></div><div className="story-copy"><span className="eyebrow">Un café para cada día</span><h2>Recíbeo na casa.<br/><em>Sen quedar nunca sen el.</em></h2><p>Escolle canto café queres e cada canto tempo. Nós seleccionamos, tostamos e enviamos. Ti só tes que poñer a auga.</p><ul><li><Check/> Envío incluído</li><li><Check/> Pausa ou cancela cando queiras</li><li><Check/> Sempre acabado de tostar</li></ul><ButtonLink to="/subscricions" light>Ver subscricións</ButtonLink></div>
    </section>
    <JournalPreview />
  </main>;
}

function Featured() {
  const { t } = useApp();
  return <section className="featured section"><div className="section-head"><div><span className="eyebrow green">Agora na tostadora</span><h2>Cafés con nome propio.</h2></div><ButtonLink to="/cafes">{t.all}</ButtonLink></div><div className="product-grid">{coffees.slice(0,3).map(c => <CoffeeCard key={c.id} coffee={c}/>)}</div></section>;
}

function CoffeeCard({ coffee }) {
  const { add, t } = useApp();
  return <article className="coffee-card"><Link to={`/cafes/${coffee.id}`} className="card-art" style={{background:coffee.color}}><span className="score">{coffee.score} pts</span><div className="mini-pack">CATAO<small>{coffee.name}<br/>{coffee.country}</small></div><span className="origin">{coffee.country}</span></Link><div className="card-info"><Link to={`/cafes/${coffee.id}`}><h3>{coffee.name}</h3></Link><p>{coffee.notes.join(" · ")}</p><div><strong>desde {coffee.price.toFixed(2)} €</strong><button onClick={() => add(coffee)} aria-label={t.add}><Plus/></button></div></div></article>;
}

function Shop() {
  const [filter, setFilter] = useState("Todos");
  const options = ["Todos", "Filtro", "Espresso", "Omniroast"];
  const filtered = filter === "Todos" ? coffees : coffees.filter(c => c.roast === filter);
  return <main><PageHero eyebrow="Café de tempada" title="Escolle a túa próxima cunca." copy="Tostamos cada semana en pequenos lotes. Todos os cafés chegan á túa casa frescos e preparados como ti prefiras."/>
    <section className="shop section"><div className="filters">{options.map(x => <button className={filter===x?"active":""} onClick={() => setFilter(x)} key={x}>{x}</button>)}</div><div className="product-grid">{filtered.map(c => <CoffeeCard key={c.id} coffee={c}/>)}</div></section></main>;
}

function Product() {
  const { id } = useParams();
  const { add } = useApp();
  const coffee = coffees.find(c => c.id === id) || coffees[0];
  const [qty, setQty] = useState(1);
  return <main className="product-page"><section className="product-visual" style={{background:coffee.color}}><div className="big-pack">CATAO<small>{coffee.name}<br/>{coffee.country}</small></div><div className="product-score">{coffee.score}<small>SCA<br/>SCORE</small></div></section><section className="product-detail"><span className="eyebrow green">{coffee.country} · {coffee.region}</span><h1>{coffee.name}</h1><div className="tasting">{coffee.notes.map(n=><span key={n}>{n}</span>)}</div><p className="lead">{coffee.description}</p><div className="facts"><div><small>Proceso</small><b>{coffee.process}</b></div><div><small>Tueste</small><b>{coffee.roast}</b></div><div><small>Formato</small><b>250 g</b></div></div><label className="select-label">Moenda<select><option>En gran</option><option>Espresso</option><option>Moka italiana</option><option>Filtro</option><option>Prensa francesa</option></select></label><div className="buy-row"><div className="qty large"><button onClick={()=>setQty(Math.max(1,qty-1))}><Minus/></button><span>{qty}</span><button onClick={()=>setQty(qty+1)}><Plus/></button></div><button className="buy" onClick={()=>add(coffee,qty)}>Engadir · {(coffee.price*qty).toFixed(2)} €</button></div><div className="shipping-note"><Check/> Envío gratis a partir de 35 € · Tostado esta semana</div></section></main>;
}

function PageHero({eyebrow, title, copy}) { return <section className="page-hero"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{copy && <p>{copy}</p>}</section>; }

function Subscriptions() {
  return <main><PageHero eyebrow="Café que chama á porta" title="A túa rutina, bastante mellor." copy="Café fresco, seleccionado por nós e entregado coa frecuencia que escollas. Sen permanencia, sen complicacións."/><section className="plans section">{[{n:"Dúas cuncas",p:"14",d:"1 bolsa · 250 g",x:"Para gozar sen présa."},{n:"Cada día",p:"26",d:"2 bolsas · 500 g",x:"A medida máis popular.",hot:true},{n:"Casa cafeteira",p:"48",d:"4 bolsas · 1 kg",x:"Para compartir. Ou non."}].map(p=><article className={p.hot?"plan hot":"plan"} key={p.n}>{p.hot&&<span className="popular">Máis escollido</span>}<Coffee/><h3>{p.n}</h3><p>{p.x}</p><strong>{p.p} € <small>/ envío</small></strong><span>{p.d}</span><button onClick={()=>alert("Formulario de subscrición listo para conectar con Stripe Billing.")}>Escoller plan <ArrowRight/></button></article>)}</section><section className="how section"><span className="eyebrow green">Así de doado</span><h2>Tres pasos. Moitas cuncas boas.</h2><div className="steps"><div><b>01</b><h3>Escolle cantidade</h3><p>Desde unha bolsa ata café para toda a oficina.</p></div><div><b>02</b><h3>Indícanos como o fas</h3><p>En gran ou moído para a túa cafeteira.</p></div><div><b>03</b><h3>Recíbeo fresco</h3><p>Tostamos, embalamos e enviamos cada semana.</p></div></div></section></main>;
}

function About() { return <main><PageHero eyebrow="Desde Galicia, mirando ao mundo" title="Poucas présas. Moita curiosidade."/><section className="about-grid section"><div className="about-photo"></div><div><span className="eyebrow green">O noso porqué</span><h2>O café pode ser moito máis que café.</h2><p>Nacemos coa idea de achegar o café de especialidade á vida cotiá. Sen elitismos nin palabras raras: só produto bo, información honesta e ganas de compartir.</p><p>Tostamos en pequenos lotes, escoitando cada café. Compramos con trazabilidade e pagamos prezos que recoñecen o traballo na orixe.</p><div className="signature">CATAO</div></div></section><section className="values section"><h2>O que non negociamos.</h2><div><article><b>01</b><h3>Sabor primeiro</h3><p>Cada decisión existe para que a cunca saiba mellor.</p></article><article><b>02</b><h3>Orixe clara</h3><p>Sabemos quen cultivou o café e como chegou ata aquí.</p></article><article><b>03</b><h3>Impacto real</h3><p>Menos discurso, mellores relacións e materiais.</p></article></div></section></main>; }

function Business() { return <main><PageHero eyebrow="CATAO para empresas" title="O café da oficina tamén conta." copy="Axudamos a cafeterías, restaurantes e equipos a servir café extraordinario sen complicacións."/><section className="business section"><div><h2>Unha solución feita á túa medida.</h2><p>Desde a selección de café e equipamento ata a formación do equipo. Cóntanos como traballades e deseñamos unha proposta que encaixe.</p><ul><li><Check/> Prezos profesionais e entrega flexible</li><li><Check/> Formación e receitas personalizadas</li><li><Check/> Mantemento e asesoramento continuo</li></ul></div><ContactForm title="Falamos?"/></section></main>; }

function JournalPreview() { return <section className="journal section"><div className="section-head"><div><span className="eyebrow green">Diario CATAO</span><h2>Para beber e para ler.</h2></div><ButtonLink to="/diario">Entrar no diario</ButtonLink></div><div className="post-grid">{posts.map(p=><article key={p.title}><div style={{backgroundImage:`url(${p.image})`}}></div><span>{p.tag} · {p.date}</span><h3>{p.title}</h3><Link to="/diario">Ler artigo <ArrowRight/></Link></article>)}</div></section>; }
function Journal() { return <main><PageHero eyebrow="Historias, receitas e orixes" title="Diario CATAO."/><JournalPreview/></main>; }

function ContactForm({title="Escríbenos"}) {
  const [sent,setSent]=useState(false);
  return <form className="contact-form" onSubmit={e=>{e.preventDefault();setSent(true)}}><h2>{title}</h2>{sent?<div className="sent"><Check/><h3>Mensaxe enviada</h3><p>Responderémosche moi pronto.</p></div>:<><label>Nome<input required placeholder="O teu nome"/></label><label>Email<input required type="email" placeholder="ola@exemplo.com"/></label><label>Mensaxe<textarea required rows="5" placeholder="Cóntanos..."/></label><button>Enviar mensaxe <ArrowRight/></button></>}</form>;
}
function Contact() { return <main><PageHero eyebrow="Estamos aquí" title="Tomamos un café?"/><section className="contact section"><div><h2>Atópanos</h2><p><MapPin/> Rúa do Pracer, 24<br/>36202 Vigo, Pontevedra</p><p><Mail/> ola@catao.cafe</p><p>Luns a venres<br/><b>09:00 — 17:00</b></p></div><ContactForm/></section></main>; }

function Footer() { return <footer><div className="footer-top"><div><Link className="logo footer-logo" to="/">CATAO</Link><p>Café de especialidade<br/>tostado en Galicia.</p></div><div><b>Explora</b><Link to="/cafes">Cafés</Link><Link to="/subscricions">Subscricións</Link><Link to="/sobre">Nós</Link><Link to="/diario">Diario</Link></div><div><b>Axuda</b><Link to="/contacto">Contacto</Link><a href="#">Envíos e devolucións</a><a href="#">Preguntas frecuentes</a><a href="#">Privacidade</a></div><div className="newsletter"><b>Cousas boas no teu correo.</b><p>Cafés novos, historias e algún segredo.</p><form onSubmit={e=>{e.preventDefault();alert("Grazas por subscribirte!")}}><input type="email" required placeholder="O teu email"/><button><ArrowRight/></button></form><a href="https://instagram.com" aria-label="Instagram"><Instagram/> @catao.cafe</a></div></div><div className="footer-bottom"><span>© 2026 CATAO Coffee Roasters</span><span>Feito con sentidiño en Galicia</span></div></footer>; }

function App() { return <AppProvider><Header/><Cart/><Routes><Route path="/" element={<Home/>}/><Route path="/cafes" element={<Shop/>}/><Route path="/cafes/:id" element={<Product/>}/><Route path="/subscricions" element={<Subscriptions/>}/><Route path="/empresas" element={<Business/>}/><Route path="/sobre" element={<About/>}/><Route path="/diario" element={<Journal/>}/><Route path="/contacto" element={<Contact/>}/><Route path="*" element={<Home/>}/></Routes><Footer/></AppProvider>; }

createRoot(document.getElementById("root")).render(<BrowserRouter><App/></BrowserRouter>);
