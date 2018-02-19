/**
 * Module query.js
 *
 * Base SQL-query helper
 *
 * @author  Marunin Alexey <amarunin@oneplus1.ru>
 * @since   0.1.0
 */

const Sequelize = require('sequelize')
const _ = require('lodash')

// TODO: вынести в конфиг
const ITEMS_PER_PAGE = 20

const Op = Sequelize.Op

module.exports = function (Model) {

  const Query = {
    attributes: [],
    where:      {},
    include:    [],
    order:      [],
    group:      [],
    limit:      0,
    offset:     0,
    page:       1,

    fromRequest (params) {
      // Если передано одно значение - ищем по первичному ключу
      if (params && !_.isObject(params)) {
        const primaryKey = _.find(Model.attributes, attribute => {
          return (attribute.primaryKey === true)
        })
        const pk = _.get(primaryKey, 'fieldName', 'id')
        return this.andWhereAttributeEqual(pk, params).parseRequest(params)
      }

      const limit = _.get(params, 'limit', ITEMS_PER_PAGE)
      const page  = _.get(params, 'page')

      this.setPageLimit(limit)
      this.setCurrentPage(page)

      return this.parseRequest(params)
    },

    // Override
    parseRequest (params) {
      return this
    },

    setAttributes (attributes) {
      if (_.isArray(attributes) && attributes.length > 1) {
        this.attributes = attributes
      }
      return this
    },

    addAttributes (attributes) {
      if (_.isArray(attributes) && attributes.length > 1) {
        this.attributes.push(attributes)
      }
      return this
    },

    addLink (model, as, required) {
      if (model) {
        if (_.isString(model)) {
          model = Model.sequelize.getModel(model)
        }
        this.include.push({model, as, required})
      }
      return this
    },

    addGroup (field) {
      if (field) {
        this.group.push(field)
      }
      return this
    },

    andWhereAttributeEqual (attribute, value) {
      if (value) {
        this.where[attribute] = value
      }
      return this
    },

    andWhereAttributeNotEqual (attribute, value) {
      if (value) {
        this.where[attribute] = {[Op.ne]: value}
      }
      return this
    },

    andWhereAttributeLike (attribute, value) {
      if (value) {
        this.where[attribute] = {like: '%' + value + '%'}
      }
      return this
    },

    andWhereAttributeBegins (attribute, value) {
      if (value) {
        this.where[attribute] = {like: value + '%'}
      }
      return this
    },

    andWhereAttributeEnds (attribute, value) {
      if (value) {
        this.where[attribute] = {like: '%' + value}
      }
      return this
    },

    andWhereAttributeGreater (attribute, value) {
      if (value) {
        this.where[attribute] = {[Op.gt]: value}
      }
      return this
    },

    andWhereAttributeGreaterOrEqual (attribute, value) {
      if (value) {
        this.where[attribute] = {[Op.gte]: value}
      }
      return this
    },

    andWhereAttributeLess (attribute, value) {
      if (value) {
        this.where[attribute] = {[Op.lt]: value}
      }
      return this
    },

    andWhereAttributeLessOrEqual (attribute, value) {
      if (value) {
        this.where[attribute] = {[Op.lte]: value}
      }
      return this
    },

    setPageLimit (limit) {
      limit = parseInt(limit)
      if (!_.isNumber(limit) || limit < 0) {
        limit = ITEMS_PER_PAGE
      }
      this.limit = limit
      return this
    },

    setCurrentPage (page) {
      let offset = 0

      page = parseInt(page)
      if (_.isNumber(page) && page >= 0) {
        if (page === 0) {
          page = 1
        }
        offset = (page - 1) * this.limit
      }

      if (offset) {
        this.offset = offset
        this.page   = page
      }

      return this
    },

    one () {
      this.setPageLimit(1)
      const query = this._buildQuery()

      return Model.findOne(query).then(item => {
        return this._populate(item)
      })
    },

    all () {
      const query = this._buildQuery()

      const result = {
        count:      0,
        totalCount: 0,
        page:       0,
        perPage:    0,
        totalPages: 0,
        items:      [],
      }

      const ceilPages = (count, limit) => {
        return (count % limit ? parseInt(count / limit) + 1 : count / limit)
      }

      return Model.count()
        .then(totalCount => {
          result.totalCount = totalCount
          return Model.findAndCountAll(query)
        })
        .then(data => {
          const count    = data.count
          let totalPages = (count > 0 ? ceilPages(count, query.limit) : 0)

          if (totalPages === 0 && count > 0) {
            totalPages = 1
          }
          if (count === 0) {
            this.page = 0
          }

          result.count      = count
          result.perPage    = query.limit
          result.page       = this.page
          result.totalPages = totalPages

          result.items = _.map(data.rows, (item) => {
            return this._populate(item)
          })

          return this.afterFindAll(result)
        })
    },

    afterFindAll (result) {
      return result
    },

    count () {
      const query = _.pick(this._buildQuery(), ['where', 'include', 'group', 'order'])
      return Model.count(query)
    },

    sum (field) {
      const query = _.pick(this._buildQuery(), ['where', 'include', 'group', 'order'])
      return Model.sum(field, query)
    },

    min (field) {
      const query = _.pick(this._buildQuery(), ['where', 'include', 'group', 'order'])
      return Model.min(field, query)
    },

    max (field) {
      const query = _.pick(this._buildQuery(), ['where', 'include', 'group', 'order'])
      return Model.max(field, query)
    },

    extend (methods) {
      return _.extend(this, methods)
    },

    _buildQuery () {
      const query = {}
      if (this.attributes.length) {
        query['attributes'] = this.attributes
      }
      if (this.include.length) {
        query['include'] = this.include
      }
      if (this.group.length) {
        query['group'] = this.group
      }
      if (_.keys(this.where).length) {
        query['where'] = this.where
      }
      if (this.order.length) {
        query['order'] = this.order
      }
      if (this.offset > 0) {
        query['offset'] = this.offset
      }
      if (this.limit > 0) {
        query['limit'] = this.limit
      }

      // console.log(query)
      return query
    },

    _populate (item) {
      if (!item) return null

      return (_.isFunction(item['populate']) ? item.populate() : item.toJSON())
    }

  }

  return Query
}
