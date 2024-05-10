const Sequelize = require("sequelize");
const _ = require("lodash");
const { ModelProps } = require("../Helpers/ModelHelper.js");
const { Op } = require("sequelize");
const getDatabase = require("./getDatabase.js");

const camparitorToOp = {
    '=': Op.eq,
    '!=': Op.ne
}

module.exports = class ModelBuilder {
    constructor(childModel, sequelize=null){
        if (!sequelize){
            sequelize = this.#getSerializer()
        }
        this.sequelize = sequelize;

        this.model = this.sequelize.define(
            childModel.table, 
            childModel.columns, 
            ModelProps(childModel.columns)
        )

        this.modelProps = {};
        this.columns = childModel.columns;
        this.childModel = childModel;
    }

    getModel = function(){
        return this.model;
    }

    getModelProps = function(){
        return this.modelProps;
    }

    //model builder methods
    //-Selects
    select = function(...select) {
        let _selects = [];
        _.forEach(select, i => {
            if (i.indexOf(' as ') > -1) {
                let iSplit = i.split(' as ');
                _selects.push([
                    iSplit[0],
                    iSplit[1]
                ]);
            } else {
                _selects.push(i);
            }
        });
        this.modelProps = {
            ...this.modelProps,
            attributes: [..._selects]
        }
        return this
    }

    addSelect = function(...select) {
        let _selects = [];
        _.forEach(select, i => {
            if (i.indexOf(' as ') > -1) {
                let iSplit = i.split(' as ');
                _selects.push([
                    iSplit[0],
                    iSplit[1]
                ]);
            } else {
                _selects.push(i);
            }
        });
        this.modelProps = {
            ...this.modelProps,
            attributes: [
                ...(this.modelProps?.attributes || []),
                ..._selects
            ]
        }
        return this
    }

    selectCount = function(...select) {
        this.modelProps = {
            ...this.modelProps,
            attributes: [
                ...(this.modelProps?.attributes || []),
                ..._.map(select, i => {
                        let col = i;
                        let colName = `${i}_count`;

                        if (col.indexOf(' as ') > -1) {
                            let colSplit = col.split(' as ');
                            col = colSplit[0];
                            colName = colSplit[1];
                        }

                        return ([
                            Sequelize.fn('COUNT', Sequelize.col(col)), 
                            colName
                        ])
                    }
                )
            ]
        }
        return this
    }

    //-Where
    where = function(...where) {
        if (_.isObject(where[0])){
            _.each(_.keys(where[0]), function(k){
                this.where(k, where[0][k])
            });
        } else {
            let column = where[0];
            let comparaitor = where[2] ? camparitorToOp[where[1]] : camparitorToOp['=']
            let value = where[2] || where[1];

            this.modelProps = {
                ...this.modelProps,
                where: {
                    ...(this.props?.where || []),
                    [Op.and] : {
                        ...(this.props?.where[Op.and] || []),
                        [column]: {
                            [comparaitor]: value
                        }
                    }
                }
            }
        }
        return this
    }

    whereNot = function(...where) {
        if (_.isObject(where[0])){
            _.each(_.keys(where[0]), function(k){
                this.where(k, where[0][k])
            });
        } else {
            let column = where[0];
            let comparaitor = camparitorToOp['!=']
            let value = where[2] || where[1];

            this.modelProps = {
                ...this.modelProps,
                where: {
                    ...(this.props?.where || []),
                    [Op.and] : {
                        ...(this.props?.where[Op.and] || []),
                        [column]: {
                            [comparaitor]: value
                        }
                    }
                }
            }
        }
        return this
    }

    orWhere = function(...where) {
        if (_.isObject(where[0])){
            _.each(_.keys(where[0]), function(k){
                this.where(k, where[0][k])
            });
        } else {
            let column = where[0];
            let comparaitor = where[2] ? camparitorToOp[where[1]] : camparitorToOp['=']
            let value = where[2] || where[1];

            this.modelProps = {
                ...this.modelProps,
                where: {
                    ...(this.props?.where || []),
                    [Op.or] : {
                        ...(this.props?.where[Op.or] || []),
                        [column]: {
                            [comparaitor]: value
                        }
                    }
                }
            }
        }
        return this
    }

    //-with
    with = function(w, f=null) {
        if (_.isArray(w)){
            _.each(w, _w=>{
                if (_.isArray(_w)){
                    this.with(_w[0], _w[1])
                } else {
                    this.with(_w);
                }
            })
        } else {
            if (this.childModel[w]){
                let association = (this.childModel[w])();
                switch (association.relationship){
                    case 'hasMany':
                        this.#hasMany({...association, alias: w}, f);
                        break;
                    case 'hasOne':
                        this.#hasOne({...association, alias: w}, f);
                        break;
                }
            }
        }
        return this;
    }

    //-ordering
    orderBy = function(col, order) {
        this.modelProps = {
            ...this.modelProps,
            order: [
                ...(this.props?.order || []),
                [col, order]
            ]
        }
        return this;
    }

    //model retrieval methods
    get = async function(...select) {
        if (select && select.length > 0) {
            await this.select(...select);
        }

        return await this.#findAll()
    }
    
    first = async function(col=null) {
        if (!col){
            col = _.keys(this.columns)[0]
        }
        await this.orderBy(col, 'asc')
        
        return await this.#findOne()
    }

    last = async function(col=null) {
        if (!col){
            col = _.keys(this.columns)[0]
        }
        await this.orderBy(col, 'desc')
        return await this.#findOne()
    }

    find = async function(id) {
        await this.where(_.keys(this.columns)[0], id);
        return await this.#findOne()
    }

    count = async function() {
        return await this.#count()
    }

    //model  creation methods
    create = async function(props){
        return await this.#create(props)
    }

    update = async function(props){
        return await this.#update(props)
    }


    delete = async function() {
        return await this.#delete();
    }

    //private methods
    #delete = async function(){
        return await this.model.destroy(this.modelProps);
    }

    #update = async function (props) {
        return await this.model.update(props)
    }


    #hasMany = async function({ model, foreignKey, localkey=this.childModel.primaryKey, alias }, f=null) {
        if (!_.find(this.modelProps?.include, {as: alias})){
            let _model = require(`./../Models/${model}.js`)(this.sequelize);
            this.model.hasMany(
                _model.getModel(),
                {foreignKey: foreignKey, sourceKey:localkey, as: alias}
            )
            
            let extraProps = f ? await f(_model).getModelProps() : {};
            
            this.modelProps = {
                ...this.modelProps,
                include: [
                    ...(this.modelProps?.include || []),
                    {
                        model: _model.getModel(),
                        as: alias,
                        ...extraProps
                    }
                ]
            }
        }
    }

    #hasOne = async function({ model, foreignKey, localkey=this.childModel.primaryKey, alias }, f=null) {
        if (!_.find(this.modelProps?.include, {as: alias})){
            let _model = require(`./../Models/${model}.js`)(this.sequelize);
            this.model.hasOne(
                _model.getModel(),
                {foreignKey: foreignKey, sourceKey:localkey, as: alias}
            )

            let extraProps = f ? f(_model).getModelProps() : {};

            this.modelProps = {
                ...this.modelProps,
                include: [
                    ...(this.modelProps?.include || []),
                    {
                        model: _model.getModel(),
                        as: alias,
                        ...extraProps
                    }
                ]
            }
        }
    }

    #create = async function(props){
        return await this.model.create(props);
    }

    #findAll = async function(){
        return await this.model.findAll(this.modelProps);
    }

    #findOne = async function(){
        return await this.model.findOne(this.modelProps);
    }

    #count = async function(){
        return await this.model.count(this.modelProps)
    }

    #getSerializer = function() {
        return getDatabase();
    }


}