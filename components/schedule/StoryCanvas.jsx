import React from 'react';

const StoryCanvas = React.forwardRef(({ day, entries, backgroundUrl, compressed }, ref) => {
  const defaultBg = 'https://images.squarespace-cdn.com/content/67e8a9cb18b2066f3f0b0b49/5ae755c3-4f3e-4906-bc12-edc9adb4a840/Forme+Schedules+%2811%29.png?content-type=image%2Fpng';
  
  return (
    <div 
      ref={ref}
      id="story-canvas"
      style={{
        width: '1080px',
        height: '1920px',
        backgroundImage: `url('${backgroundUrl || defaultBg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
        transform: 'scale(0.25)',
        transformOrigin: 'top center',
        fontFamily: "'Cormorant Garamond', serif"
      }}
    >
      {/* Header Area */}
      <div style={{
        height: '450px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: '100%'
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '140px',
          fontWeight: 400,
          letterSpacing: '10px',
          margin: 0,
          textTransform: 'uppercase',
          textAlign: 'center',
          color: 'white'
        }}>
          {day.toUpperCase()}
        </h1>
      </div>

      {/* Glass Card */}
      <div 
        id="main-card"
        style={{
          width: '90%',
          height: 'auto',
          maxHeight: '1600px',
          background: 'rgba(120, 110, 90, 0.75)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          border: '4px solid rgba(255, 255, 255, 0.7)',
          borderRadius: '130px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          padding: compressed ? '50px 60px' : '80px 70px',
          transform: 'translateY(-80px)',
          transition: 'all 0.3s ease'
        }}
      >
        <div id="schedule-list" style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {entries.map((entry, index) => (
            <div 
              key={index}
              className="instructor-row"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                borderBottom: index < entries.length - 1 ? '2.5px solid rgba(255,255,255,0.15)' : 'none',
                paddingBottom: index < entries.length - 1 ? (compressed ? '25px' : '45px') : 0,
                marginBottom: index < entries.length - 1 ? (compressed ? '25px' : '45px') : 0
              }}
            >
              <img 
                src={entry.instructor_image} 
                alt={entry.instructor_name}
                crossOrigin="anonymous"
                style={{
                  width: compressed ? '165px' : '230px',
                  height: compressed ? '165px' : '230px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: '50px',
                  flexShrink: 0,
                  transition: 'all 0.3s ease'
                }}
              />
              <div className="info">
                <b style={{
                  display: 'block',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: compressed ? '48px' : '60px',
                  fontWeight: 500,
                  letterSpacing: '3px',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}>
                  {entry.instructor_name.toUpperCase()}
                </b>
                {entry.time_slots.map((time, i) => (
                  <span key={i} style={{
                    display: 'block',
                    fontFamily: "'Optima', serif",
                    fontSize: compressed ? '32px' : '38px',
                    fontWeight: 300,
                    marginBottom: '5px',
                    opacity: 0.9,
                    color: 'white',
                    letterSpacing: '2px',
                    transition: 'all 0.3s ease'
                  }}>
                    {time}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

StoryCanvas.displayName = 'StoryCanvas';

export default StoryCanvas;
