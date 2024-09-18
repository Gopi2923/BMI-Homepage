import React from 'react'

const YoutubeVideo = () => {
  return (
    <div>
            {/* Video Section */}
            <div className="video-section">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/Erhv6vECfPU?autoplay=1&loop=1&playlist=Erhv6vECfPU"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="video"
        ></iframe>
      </div>
    </div>
  )
}

export default YoutubeVideo
