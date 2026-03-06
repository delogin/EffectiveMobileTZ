exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createType('user_role', ['admin', 'user']);
    pgm.createTable('users', {
        userId:           {
            type:       'bigserial',
            primaryKey: true,
        },
        FirstName:         {
            type: 'varchar(100)',
            comment:'Имя пользователя',
            notNull: true
        },
        MiddleName: {
            type: 'varchar(100)',
            comment: 'Отчество пользователя',
        },
        LastName:{
            type: 'varchar(100)',
            comment: 'Фамилия пользователя',
            notNull: true
        },
        userEmail:{
            type: 'varchar(500)',
            notNull: true,
            unique: true
        },
        birthDate: {
            type: 'date',
            comment: 'Дата рождения',
            notNull: true
        },
        userPassword:{
            type: 'varchar(1000)',
            comment: 'пароль',
            notNull: true
        },
        userRole:{
            type:  'user_role',
            notNull: true,
            comment: 'роль (admin, user)',
            default: 'user'
        },
        isActive:{
            type: 'boolean', 
            notNull: true,
            default: true
        },
        createDate: {
          type: 'timestamp with time zone',
          default: pgm.func('now()'),
          notNull: true,
        },
        updateDate: {
          type: 'timestamp with time zone',
          default: pgm.func('now()'),
          notNull: true,
        },


    }, {
        ifNotExists: true,
        comment:'Асортимент товаров'
    });
};

exports.down = pgm => {
};