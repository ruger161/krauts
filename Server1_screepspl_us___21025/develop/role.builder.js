let roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        const utilCommon = require('utils.common');

        let storage = creep.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return (structure.structureType === STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 49000)
            }
        });

        let hostile = utilCommon.hostileCreep(creep.pos);
        if (creep.hits < creep.memory.lastHits) {
            Game.notify('Creep ' + creep + ' has been attacked at ' + creep.pos + ' by ' + hostile.owner.username + '!');
        }
        creep.memory.lastHits = creep.hits;

        if (creep.memory.repairing && creep.carry.energy === 0) {
            creep.memory.repairing = false;
            creep.say('harvest');
        }
        if (!creep.memory.repairing && creep.carry.energy === creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('build');
        }

        if (creep.memory.repairing) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00ff17'}});
                }
            }
        }
        /*	    else {
         var sources = creep.room.find(FIND_STRUCTURES, {
         filter: (structure) => {
         return (structure.structureType == STRUCTURE_EXTENSION
         || structure.structureType == STRUCTURE_SPAWN) &&
         structure.energy == structure.energyCapacity
         }
         });

         if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
         creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
         }
         }
         }
         };*/
        else {
            if (storage.length > 0) {
                if (creep.withdraw(storage[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                let sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(
                        sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;