import cytoscape from "cytoscape";

export class CytoscapeService {
  cy = cytoscape({
    container: document.getElementById("cy"), // container to render in

    elements: [],

    style: [
      // the stylesheet for the graph
      {
        selector: "node",
        style: {
          "background-color": "#666",
          label: "data(id)",
        },
      },

      {
        selector: "edge",
        style: {
          width: 1.1,
          "line-color": "#ccc",
          "target-arrow-color": "#ccc",
          "curve-style": "bezier",
          label: "data(label)",
        },
      },
    ],

    layout: {
      name: "grid",
      rows: 1,
    },
  });

  constructor() {}

  drawGraph(graph: number[][]) {
    let elements:
      | cytoscape.ElementsDefinition
      | cytoscape.ElementDefinition
      | cytoscape.ElementDefinition[]
      | cytoscape.CollectionArgument = [];

    for (let i = 0; i < graph.length; i++) {
      elements.push({ group: "nodes", data: { id: `n${i}` } });
      for (let j = i + 1; j < graph[i].length; j++) {
        elements.push({
          group: "edges",
          data: {
            id: `e${i}${j}`,
            source: `n${i}`,
            target: `n${j}`,
            label: graph[i][j],
          },
        });
      }
    }

    this.cy.elements().remove();
    this.cy.add(elements);

    const layout = this.cy.elements().layout({
      name: "circle",
    });

    layout.run();
  }

  colorizedGraph(values: number[][]) {
    let maxValue = Math.max(...values.map((x) => Math.max(...x)));

    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values[i].length; j++) {
        let nv = values[i][j] / maxValue;
        this.cy.elements(`edge[id = 'e${i}${j}']`).style({
          "line-color": HSLToHex(0, nv * 100, 50),
          width: nv * 5 + 0.5,
        });
      }
    }
  }
}

/**
 * Конвертировать HSL в HEX
 * @param h оттенок [0, 359]
 * @param s Насыщенностью [0, 100]
 * @param l Яркость [0, 100]
 * @returns HEX
 */
function HSLToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  let sr = Math.round((r + m) * 255).toString(16);
  let sg = Math.round((g + m) * 255).toString(16);
  let sb = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (sr.length == 1) sr = "0" + sr;
  if (sg.length == 1) sg = "0" + sg;
  if (sb.length == 1) sb = "0" + b;

  return "#" + sr + sg + sb;
}
