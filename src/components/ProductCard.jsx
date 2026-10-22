import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { enquiry } from "@/data/jewellery";

export default function ProductCard({product}) {
  return <article className="jewel-card">
    <Link href={`/jewellery/${product.slug}`} className="jewel-image">
      <Image src={product.image} alt={product.name} fill unoptimized sizes="(max-width: 700px) 100vw, 33vw"/>
      <span>{product.code}</span>
    </Link>
    <div className="jewel-card-info">
      <div><small>{product.category}</small><h3>{product.name}</h3></div>
      <Link href={`/jewellery/${product.slug}`} aria-label={`View ${product.name}`}><ArrowUpRight/></Link>
    </div>
    <a className="jewel-enquiry" href={enquiry(product)} target="_blank" rel="noopener noreferrer">Enquire for price <ArrowUpRight size={15}/></a>
  </article>;
}
