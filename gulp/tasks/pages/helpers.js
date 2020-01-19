import startsWith from 'lodash/startsWith';
import endsWith from 'lodash/endsWith';
import round from 'lodash/round';
import capitalize from 'lodash/capitalize';

export function url(deploy, baseURL) {
  // Remove final forward slash from the baseURL if it exists
  if (endsWith(baseURL, '/')) {
    baseURL = baseURL.slice(0, -1);
  }

  return (link) => {
    // check if a forward slash exists, if not, then add it.
    if (!startsWith(link, '/')) {
      link = `/${link}`;
    }
    // use absolute urls if this is a production build
    if (deploy) {
      return `${baseURL}${link}`;
    }
    return link;
  };
}

// ROADMAP rewrite this thing
export const generateNavObject = (data) => {
  const output = {};
  let item;
  let depth;
  let itemOutput;
  let itemName;
  let itemPath;

  for (let i = 0; i < data.length; i++) {
    item = data[i];
    // handle the item object output
    // handle getting the filename
    itemName = item.path.split('/');
    itemName = itemName[itemName.length - 1].split('.');
    itemName = itemName[0];
    // handle getting the proper path
    itemPath = item.path.split('.');
    itemPath = `${itemPath[0]}/`;
    // final output of the item
    itemOutput = {
      title: item.title || capitalize(itemName),
      path:  itemPath
    };
    // check if there's a category key
    if (item.category) {
      // Check if the category exists, if not, add it.
      if (!output[item.category]) {
        output[item.category] = {};
      }
      // Check if subcategory exists, if not, add it.
      if (item.sub_category) {
        // eslint-disable-next-line
        if (!output[item.category][item.sub_category]) {
          output[item.category][item.sub_category] = {};
        }
        depth = 3;
        output[item.category][item.sub_category][itemName] = itemOutput;
      } else {
        depth = 2;
        output[item.category][itemName] = itemOutput;
      }
    } else {
      depth = 1;
      output[itemName] = itemOutput;
    }
  }
  return {depth, output};
};

// NOTE This probably doesnt need to exist
export const borderGradiantString = (points, colors) => {
  let slices = [];
  let slice;
  let string = '';
  let currentPercent = 0;
  let previousPercent;

  for (let category in points) {
    if (category !== 'total' && points[category] !== 0) {
      previousPercent = round((points[category] / points.total) * 100, 2);
      currentPercent += previousPercent;
      slice = {percent: currentPercent};
      if (colors[category]) {
        slice.color = colors[category];
      }
      // console.log(slice);
      slices.push(slice);
    }
  }
  // console.log(slices);
  for (let i = 0; i < slices.length; i++) {
    if (i === 0) {
      string += `${slices[i].color}, `;
    }
    if (i !== 0 && i < slices.length - 1) {
      string += `${slices[i - 1].color} ${slices[i].percent}%,
        ${slices[i].color} ${slices[i].percent}%, `;
    }
    if (i === slices.length - 1) {
      string += `${slices[i - 1].color} ${slices[i].percent}%,
        ${slices[i].color} ${slices[i].percent}%`;
    }
  }
  // console.log(`conic-gradient(${string})`);
  return string;
};
