import { ArrowUpRight, MessageCircle } from "lucide-react";
import { enquiry } from "@/data/jewellery";

export const metadata={title:"Contact | Vrinda Élle"};

export default function Contact(){
  return <main className="inner-page">
    <section className="contact-page">
      <span className="section-kicker">WE WOULD LOVE TO HEAR FROM YOU</span>
      <h1>Let's talk about<br/><em>something beautiful.</em></h1>
      <p>Found a piece you love? Ask us about pricing, availability, styling or how to order. We are just a message away.</p>
      <a className="primary-button" href={enquiry()} target="_blank" rel="noopener noreferrer"><MessageCircle size={19}/> Chat on WhatsApp <ArrowUpRight size={18}/></a>
      <div className="contact-footnote">PERSONAL ENQUIRIES · PRODUCT DETAILS · ORDER ASSISTANCE</div>
    </section>
  </main>;
}
