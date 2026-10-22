import CategoryShowcase from "./CategoryShowcase";
import Link from "next/link";
import { ArrowUpRight, Gem, Heart, Sparkles, Flower2 } from "lucide-react";
import { enquiry } from "@/data/jewellery";

export const metadata = {
  title:"Our Story | Vrinda Élle",
  description:"Discover our world of artificial jewellery, from head adornments and bridal sets to rings, anklets and everyday pieces."
};

const categories = [
  ["01","Head Adornments","Maang tikka, matha patti and statement head jewellery."],
  ["02","Earrings & Nose Jewellery","Jhumkas, chandbalis, studs, hoops and nose pins."],
  ["03","Neck & Shoulder","Chokers, necklaces, haar sets and layered statement pieces."],
  ["04","Hands & Wrists","Bangles, kadas, bracelets, haath phool and rings."],
  ["05","Waist Jewellery","Kamarbandh and occasion-inspired waist accessories."],
  ["06","Feet & Ankles","Payal, anklets and toe rings for the finishing touch."]
];

const occasions = [
  {title:"The Bridal Edit",description:"Statement jewellery ideas for weddings, ceremonies and treasured celebrations.",image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1100&q=85"},
  {title:"Festive Moments",description:"Expressive adornments for celebrations, gatherings and special evenings.",image:"https://images.unsplash.com/photo-1630019852942-f89202989a59?w=1100&q=85"},
  {title:"Everyday Elegance",description:"Subtle jewellery for personal style and everyday dressing.",image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1100&q=85"}
];

export default function OurStory(){
  return <main className="min-h-screen overflow-hidden bg-[#211b18] text-[#e3d6c4]">
    <section className="flex min-h-[680px] flex-col items-start justify-center bg-[radial-gradient(ellipse_at_85%_20%,#514235,#211b18_65%)] px-[7%] pb-24 pt-44 md:px-[9%] md:pt-52">
      <span className="text-[10px] font-medium tracking-[3px] text-[#c5a572]">OUR WORLD OF JEWELLERY</span>
      <h1 className="my-8 font-serif text-[clamp(54px,9vw,140px)] leading-[1.05] tracking-[-3px]">Every detail.<br/><em className="font-normal text-[#c5a572]">Every expression.</em></h1>
      <p>From the first adornment in your hair to the delicate finishing touch at your feet, jewellery is a way to express who you are.</p>
      <Link href="/collections" className="mt-9 inline-flex items-center justify-between gap-8 bg-[#c5a572] px-7 py-5 text-[11px] font-medium tracking-wider text-[#211b18] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e3d6c4]">Explore our collections <ArrowUpRight size={18}/></Link>
    </section>

    <section className="grid bg-[#302824] md:grid-cols-2">
      <div className="h-[420px] overflow-hidden md:h-auto md:min-h-[650px]">
        <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1300&q=85" alt="Gold-tone jewellery editorial"/>
      </div>
      <div className="flex flex-col items-start justify-center px-[7%] py-20 md:px-[10%] md:py-28">
        <span className="text-[10px] font-medium tracking-[3px] text-[#c5a572]">THE STORY OF ADORNMENT</span>
        <h2 className="my-7 font-serif text-[clamp(46px,6vw,92px)] leading-[1.1] tracking-[-2px]">More than an<br/><em className="font-normal text-[#c5a572]">accessory.</em></h2>
        <p>Jewellery has always been part of how we celebrate, remember and express ourselves. Some pieces complete a bridal look. Others become a favourite detail in everyday life.</p>
        <p>Our artificial jewellery range brings together styles for the head, ears, nose, neck, hands, waist and feet, creating a world where every detail has its place.</p>
        <p>Whether your style is traditional, contemporary, understated or bold, the right adornment can make a moment feel entirely your own.</p>
      </div>
    </section>

    <section className="bg-[#34372e] px-[7%] py-24 md:py-32">
      <div className="mb-14 max-w-[850px]">
        <span className="text-[10px] font-medium tracking-[3px] text-[#c5a572]">FROM HEAD TO TOE</span>
        <h2 className="my-7 font-serif text-[clamp(46px,6vw,92px)] leading-[1.1] tracking-[-2px]">A complete world<br/>of <em className="font-normal text-[#c5a572]">adornment.</em></h2>
        <p>Discover jewellery styles for every part of your look.</p>
      </div>
      <CategoryShowcase/>
    </section>

    <section className="bg-[#211b18] px-[7%] py-24 md:py-32">
      <div className="mb-14 max-w-[850px]">
        <span className="text-[10px] font-medium tracking-[3px] text-[#c5a572]">WHAT INSPIRES US</span>
        <h2 className="my-7 font-serif text-[clamp(46px,6vw,92px)] leading-[1.1] tracking-[-2px]">Beauty in the<br/><em className="font-normal text-[#c5a572]">little details.</em></h2>
      </div>
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-4">
        <article><Gem/><h3>Personal Expression</h3><p>Jewellery that complements different moods, personalities and individual styles.</p></article>
        <article><Flower2/><h3>Tradition & Modernity</h3><p>From traditional-inspired adornments to contemporary statement designs.</p></article>
        <article><Heart/><h3>Meaningful Moments</h3><p>Pieces for weddings, festivals, special occasions and everyday memories.</p></article>
        <article><Sparkles/><h3>Complete Styling</h3><p>Explore jewellery for every detail, from headpieces to anklets and toe rings.</p></article>
      </div>
    </section>

    <section className="bg-[#302824] px-[7%] py-24 md:py-32">
      <div className="mb-14 max-w-[850px]">
        <span className="text-[10px] font-medium tracking-[3px] text-[#c5a572]">DRESS FOR THE MOMENT</span>
        <h2 className="my-7 font-serif text-[clamp(46px,6vw,92px)] leading-[1.1] tracking-[-2px]">Every occasion<br/><em className="font-normal text-[#c5a572]">has a story.</em></h2>
      </div>
      <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
        {occasions.map(item=><article key={item.title}>
          <div className="h-[360px] overflow-hidden bg-[#34372e] md:h-[430px]"><img src={item.image} alt={item.title}/></div>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>)}
      </div>
    </section>

    <section className="flex flex-col items-start bg-[radial-gradient(ellipse_at_85%_20%,#444233,#211b18_70%)] px-[7%] py-28 md:px-[9%] md:py-40">
      <span className="text-[10px] font-medium tracking-[3px] text-[#c5a572]">LET'S FIND YOUR PIECE</span>
      <h2 className="my-7 font-serif text-[clamp(46px,6vw,92px)] leading-[1.1] tracking-[-2px]">Something beautiful<br/><em className="font-normal text-[#c5a572]">starts here.</em></h2>
      <p>Looking for a particular jewellery style or complete occasion look? Contact us to enquire about designs, prices and availability.</p>
      <a href={enquiry()} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex items-center justify-between gap-8 bg-[#c5a572] px-7 py-5 text-[11px] font-medium tracking-wider text-[#211b18] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e3d6c4]">Enquire on WhatsApp <ArrowUpRight size={18}/></a>
    </section>
  </main>;
}
