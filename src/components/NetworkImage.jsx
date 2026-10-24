"use client";
import Image from "next/image";
import {useState} from "react";

export default function NetworkImage({src,alt="",className="",fill=false,width,height,priority=false,loading,sizes,unoptimized=false,...props}){
  const [state,setState]=useState({src,loaded:false,failed:false});
  const loaded=state.src===src&&state.loaded;
  const failed=state.src===src&&state.failed;

  return <div className="network-image">
    {!loaded&&!failed&&<div aria-hidden="true" className="network-image-placeholder"/>}
    {(!src||failed)?(
      <div role="img" aria-label={alt||"Image unavailable"} className="network-image-fallback">
        Image unavailable
      </div>
    ):(
      <Image
        {...props}
        src={src}
        alt={alt}
        fill={fill}
        width={fill?undefined:width}
        height={fill?undefined:height}
        priority={priority}
        loading={priority?undefined:loading}
        sizes={sizes}
        unoptimized={unoptimized}
        className={`${className} ${loaded?"network-image-loaded":"network-image-loading"}`}
        onLoad={()=>setState({src,loaded:true,failed:false})}
        onError={()=>setState({src,loaded:false,failed:true})}
      />
    )}
  </div>;
}
