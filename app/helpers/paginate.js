const _ = require('lodash');

function Paginator(req) {
  this.page = req.page || 1;
  this.per_page = req.per_page || 15;

  if (this.page <= 0) {
    this.page = 1;
  }

  if (this.per_page <= 0) {
    this.per_page = 1;
  }

  return this;
}

Paginator.prototype = {
  combine(key0, key1, pg, content) {
    return {
      [key0]: {
        ...pg,
        [key1]: content,
      },
    };
  },

  decorate(key0, key1, list) {
    // eslint-disable-next-line no-underscore-dangle
    if (list.__chain__) {
      const data = list.drop((this.page - 1) * this.per_page).take(this.per_page);

      return this.combine(key0, key1, {
        _attr_page: this.page,
        _attr_per_page: this.per_page,
        _attr_pages: Math.ceil(data.size().value() / this.per_page),
      }, data.value());
    }

    if (!_.isArray(list)) {
      return this.combine(key0, key1, {
        _attr_page: 1,
        _attr_per_page: this.per_page,
        _attr_pages: 1,
      }, [list]);
    }

    if (list.length === 0) {
      return this.combine(key0, key1, {
        _attr_page: 1,
        _attr_per_page: this.per_page,
        _attr_pages: 1,
      }, []);
    }

    // enfore this case inside a lodash.chain
    return this.combine(key0, key1, {
      _attr_page: this.page,
      _attr_per_page: this.per_page,
      _attr_pages: Math.ceil(list.length / this.per_page),
    }, _.chain(list).drop((this.page - 1) * this.per_page).take(this.per_page).value());
  },
};

module.exports = Paginator;
