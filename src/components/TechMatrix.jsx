import dockerIcon    from '../assets/Docker_Icon.png';
import githubIcon    from '../assets/GitHub_Icon.png';
import pythonIcon    from '../assets/Python_Icon.png';
import javaIcon      from '../assets/Java_Icon.png';
import cIcon         from '../assets/C_Icon.png';
import html5Icon     from '../assets/HTML5_Icon.png';
import cssIcon       from '../assets/CSS_Icon.png';
import jsIcon        from '../assets/JavaScript_Icon.png';
import pgsqlIcon     from '../assets/PGSQL_Icon.png';
import bashIcon      from '../assets/Bash_Icon.png';
import postmanIcon   from '../assets/Postman_Icon.webp';
import fastapiIcon   from '../assets/fastapi_Icon.svg';
import pydanticIcon  from '../assets/Pydantic_Icon.png';
import nodejsIcon    from '../assets/NodeJS_Icon.svg';
import expressIcon   from '../assets/Express_Icon.webp';
import reactIcon     from '../assets/React_Icon.png';
import tailwindIcon  from '../assets/Tailwind_Icon.png';
import viteIcon      from '../assets/Vite_Icon.png';
import pytestIcon    from '../assets/Pytest_logo.svg';
import jestIcon      from '../assets/Jest_icon.png';
import eslintIcon    from '../assets/ESLint_Icon.svg';

const COLUMNS = [
  [
    { name: 'Python',     src: pythonIcon  },
    { name: 'Java',       src: javaIcon    },
    { name: 'JavaScript', src: jsIcon      },
    { name: 'C',          src: cIcon       },
    { name: 'HTML5',      src: html5Icon   },
    { name: 'CSS',        src: cssIcon     },
    { name: 'Bash',       src: bashIcon    },
  ],
  [
    { name: 'React',      src: reactIcon   },
    { name: 'Vite',       src: viteIcon    },
    { name: 'Tailwind',   src: tailwindIcon},
    { name: 'FastAPI',    src: fastapiIcon },
    { name: 'Express',    src: expressIcon },
    { name: 'NodeJS',     src: nodejsIcon  },
    { name: 'Pydantic',   src: pydanticIcon},
  ],
  [
    { name: 'Docker',     src: dockerIcon  },
    { name: 'PostgreSQL', src: pgsqlIcon   },
    { name: 'GitHub',     src: githubIcon  },
    { name: 'Postman',    src: postmanIcon },
    { name: 'Pytest',     src: pytestIcon  },
    { name: 'Jest',       src: jestIcon    },
    { name: 'ESLint',     src: eslintIcon  },
  ],
];

// Each column scrolls at a slightly different speed; middle column reverses direction
const SPEEDS  = [22, 28, 20]; // seconds per full loop
const DIRS    = ['up', 'down', 'up'];

function TechColumn({ icons, direction, speed }) {
  // Duplicate the list so the loop is seamless
  const track = [...icons, ...icons];

  return (
    <div className="tech-col">
      <div
        className="tech-col-track"
        style={{ animationName: direction === 'up' ? 'techScrollUp' : 'techScrollDown', animationDuration: `${speed}s` }}
      >
        {track.map((icon, i) => (
          <div key={i} className="tech-cell" title={icon.name}>
            <img
              src={icon.src}
              alt={icon.name}
              className="tech-icon"
              loading="lazy"
              draggable="false"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechMatrix() {
  return (
    <div className="tech-matrix">
      {COLUMNS.map((icons, i) => (
        <TechColumn
          key={i}
          icons={icons}
          direction={DIRS[i]}
          speed={SPEEDS[i]}
        />
      ))}
    </div>
  );
}
