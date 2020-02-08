import startsWith from 'lodash/startsWith';
import endsWith from 'lodash/endsWith';
import round from 'lodash/round';
import capitalize from 'lodash/capitalize';

/**
 * Adds suffix to number passed.
 *
 * @method _addSuffixToNumber
 *
 * @param  {number}          number - The number to have a suffix added to.
 *
 * @return {string}                 - Number with suffix added.
 */
function addSuffixToNumber(number) {
  // Get remainder of `number` divided by 10.
  var lastDigit = number % 10;
  // Get remainder of `number` divided by 100.
  var lastTwoDigits = number % 100;
  // If lastDigit is 1 but last two digits not 1, return with added "st".
  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return number + 'st';
  }
  // If lastDigit is 2 but second to last digit is not 1, return with added "nd".
  if (lastDigit === 2 && lastTwoDigits !== 12) {
    return number + 'nd';
  }
  // If lastDigit is 2 but second to last digit is not 1, return with added "rd".
  if (lastDigit === 3 && lastTwoDigits !== 13) {
    return number + 'rd';
  }
  // For all other numbers, return with added "th".
  return number + 'th';
}

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

export const parseDate = (date, display) => {
  const dateArray = date.split('-');
  const months = {
    full: [
      'January',
      'Feburary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ],
    abbrv: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec'
    ]
  };

  const year = dateArray[0];
  const month =
    display === 'full' ?
      months.full[dateArray[1] - 1] :
      display === 'abbreviate' ?
        months.abbrv[dateArray[1] - 1] :
        dateArray[1];
  const day =
    display === 'full' || display === 'abbreviate' ?
      addSuffixToNumber(parseFloat(dateArray[2])) :
      dateArray[2];

  return {
    year,
    month,
    day
  };
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
