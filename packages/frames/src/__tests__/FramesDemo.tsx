/**
 * Frame Rendering System Demo
 */

import React from 'react';
import {
  FrameSVGOctagon,
  FrameSVGKranox,
  FrameSVGCorners,
  FrameSVGLines,
  FrameSVGUnderline,
  FrameSVGNefrex,
} from '../variants';

export const FramesDemo: React.FC = () => {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Frame Rendering System Demo</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {/* Octagon Frame */}
        <div>
          <h2>Octagon Frame</h2>
          <FrameSVGOctagon
            width={300}
            height={200}
            color="#00ffff"
            strokeWidth={2}
            cornerSize={20}
          >
            <div
              style={{
                padding: '20px',
                color: '#00ffff',
                fontSize: '14px',
              }}
            >
              Octagonal frame with cut corners
            </div>
          </FrameSVGOctagon>
        </div>

        {/* Kranox Frame */}
        <div>
          <h2>Kranox Frame</h2>
          <FrameSVGKranox
            width={300}
            height={200}
            color="#ff00ff"
            strokeWidth={2}
            lineLength={20}
          >
            <div
              style={{
                padding: '20px',
                color: '#ff00ff',
                fontSize: '14px',
              }}
            >
              Kranox-style assembly frame
            </div>
          </FrameSVGKranox>
        </div>

        {/* Corners Frame */}
        <div>
          <h2>Corners Frame</h2>
          <FrameSVGCorners
            width={300}
            height={200}
            color="#00ff00"
            strokeWidth={2}
            cornerSize={20}
            position="outside"
          >
            <div
              style={{
                padding: '20px',
                color: '#00ff00',
                fontSize: '14px',
              }}
            >
              Corner-only frame
            </div>
          </FrameSVGCorners>
        </div>

        {/* Lines Frame */}
        <div>
          <h2>Lines Frame</h2>
          <FrameSVGLines
            width={300}
            height={200}
            color="#ffff00"
            strokeWidth={2}
            dashArray="5,5"
          >
            <div
              style={{
                padding: '20px',
                color: '#ffff00',
                fontSize: '14px',
              }}
            >
              Dashed line frame
            </div>
          </FrameSVGLines>
        </div>

        {/* Underline Frame */}
        <div>
          <h2>Underline Frame</h2>
          <FrameSVGUnderline
            width={300}
            height={200}
            color="#ff6600"
            strokeWidth={2}
            cornerSize={10}
          >
            <div
              style={{
                padding: '20px',
                color: '#ff6600',
                fontSize: '14px',
              }}
            >
              Underline with corner squares
            </div>
          </FrameSVGUnderline>
        </div>

        {/* Nefrex Frame */}
        <div>
          <h2>Nefrex Frame</h2>
          <FrameSVGNefrex
            width={300}
            height={200}
            color="#00ccff"
            strokeWidth={2}
            lineLength={15}
          >
            <div
              style={{
                padding: '20px',
                color: '#00ccff',
                fontSize: '14px',
              }}
            >
              Nefrex-style assembly frame
            </div>
          </FrameSVGNefrex>
        </div>
      </div>

      {/* Responsive Example */}
      <div style={{ marginTop: '40px' }}>
        <h2>Responsive Frame</h2>
        <div style={{ maxWidth: '500px' }}>
          <FrameSVGOctagon
            width={500}
            height={300}
            color="#00ffff"
            strokeWidth={2}
            cornerSize={30}
            responsive={true}
          >
            <div
              style={{
                padding: '20px',
                color: '#00ffff',
                fontSize: '14px',
              }}
            >
              This frame is responsive and scales with the container
            </div>
          </FrameSVGOctagon>
        </div>
      </div>
    </div>
  );
};

export default FramesDemo;
