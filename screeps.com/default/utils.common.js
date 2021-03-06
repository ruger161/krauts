let count;

let utilCommon = {
    getRoom: function () {
        return Game.spawns['Spawn1'].room;
    },
    getAmountOfEnergyForSpawn: function (room) {
        try {
            let structures = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_EXTENSION
                        || structure.structureType === STRUCTURE_SPAWN
                }
            });
            let amount = 0;
            for (let i = 0; i < structures.length; i++) {
                amount = amount + structures[i].energy;
            }
            return amount;
        } catch (e) {
            console.log(e.stack);
        }
    },
    hostileCreep: function (pos) {
        return pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    },
    setRoad: function (position) {
        try {
            let isUsed = 0;
            let isThereARoad = position.lookFor(LOOK_STRUCTURES).filter(structure => {
                return structure.structureType === STRUCTURE_ROAD
            })[0];

            let isThereAConstructionSide = position.lookFor(LOOK_CONSTRUCTION_SITES)[0];
            // console.log("Is there a Road at pos "+position+" : "+ !isThereARoad);
            if (!isThereARoad && !isThereAConstructionSide) {
                //     if (false) {
                // let plannedRoadName = "PlannedRoadAtRoom:"+position.room.name+"X" + position.x +"Y"+position.y;

                // console.log("Is Memory undefined? "+ (Memory.plannedRoads == undefined));

                if (Memory.plannedRoads === undefined) {
                    Memory.plannedRoads = [{pos: position, usability: 0}];
                } else {
                    for (let r = 0; r < Memory.plannedRoads.length; r++) {

                        // console.log("Is road at "+r+" === position? " + ( JSON.stringify(Memory.plannedRoads[r].pos) ===  JSON.stringify(position)));

                        if (JSON.stringify(Memory.plannedRoads[r].pos) === JSON.stringify(position)) {
                            isUsed++;
                            // console.log("Is Used was Incremented!");
                            if (Memory.plannedRoads[r].usability < 6) {
                                Memory.plannedRoads[r].usability++;
                            } else {
                                // console.log("Set Road at " + position);
                                position.createConstructionSite(STRUCTURE_ROAD);
                                Memory.plannedRoads.splice(r, 1);
                            }
                        }
                    }
                }
                if (isUsed === 0) {
                    Memory.plannedRoads.push({pos: position, usability: 0});
                }
            }

        } catch (e) {
            console.log(e.stack)
        }
        // pos.createConstructionSite(STRUCTURE_ROAD)

    },
    changeRole: function (creep) {
        if(Memory.healerx < Memory.healerx+2){
            console.log('Change role of' + creep.name + 'to healer.');
            creep.memory.role = 'healer';
        }else if(Memory.harvesterx < Memory.harvesterx+1){
            console.log('Change role of' + creep.name + 'to harvester.');
            creep.memory.role = 'harvester';
        }
    },
    freeMiningSide: function () {
        try {
            //get vision, put flags on all sources,
            // if Game.getObjectById(flag.memory.mining) === undefined,
            // spawn miner, assign miner id to flag.memory.mining,
            // send it over to get started
            let miningFlag;
            //console.log(Memory.flags);
            for (let flag in Memory.flags) {
                if (Game.flags[flag].name.includes("Mining")) {
                    // console.log(Game.flags[flag].memory.usedBy)
                    // console.log(Game.flags[flag].usedBy)
                    if (Game.flags[flag].memory.usedBy === undefined) {
                        miningFlag = Game.flags[flag];
                    }
                }
            }
            if (miningFlag) {
                // Game.flags[miningflag.name].memory.usedBy = true;
                return [true, miningFlag];
            } else
                return [false, {}];
        } catch (e) {
            console.log(e.stack);
        }
    },
    setMiningSideAsUsed(name, flag) {
        Game.flags[flag].memory.usedBy = name;
    },
    deleteMeOutOfMiningSide: function (flag) {
        try {
            delete Game.flags[flag].memory.usedBy;
        } catch (e) {
            console.log(e.stack);
        }
    },
    findCarryableMiningSide: function () {
        try {
            //get vision, put flags on all sources,
            // if Game.getObjectById(flag.memory.mining) === undefined,
            // spawn miner, assign miner id to flag.memory.mining,
            // send it over to get started
            let carryGround;


            for (flag in Memory.flags) {

                if (Game.flags[flag].name.includes("Mining")) {
                    // console.log(Game.flags[flag].memory.carried == undefined)
                    // console.log(Game.flags[flag].memory.usedBy)
                    // console.log(Game.flags[flag].usedBy)
                    if (Game.flags[flag].memory.carried == undefined) {
                        carryGround = Game.flags[flag];
                    }
                }
            }

            if (carryGround) {
                // console.log(Memory.flags[carryGround.name].usedBy);
                // Memory.flags[carryGround.name].memory.usedBy = true;
                return [true, carryGround];
            } else
                return [false, {}];
        } catch (e) {
            console.log(e.stack);
        }
    },
    setCarryableMiningSideAsUsed(name, flag) {
        Game.flags[flag].memory.carried = name;

    },
    deleteMeOutOfCarryableSide: function (flag) {
        try {
            delete Game.flags[flag].memory.carried;
        } catch (e) {
            console.log(e);
        }
        // try {
        //
        //     // Memory.flags[flag.name] = Game.flags[flag.name];
        //     //get vision, put flags on all sources,
        //     // if Game.getObjectById(flag.memory.mining) === undefined,
        //     // spawn miner, assign miner id to flag.memory.mining,
        //     // send it over to get started
        //
        //
        //     //     // let miningflags = .find(FIND_FLAGS, {
        //     //     filter: flag => {
        //     //         return flag.name.includes("Mining")
        //     //     }
        //     // });
        // } catch (e) {
        //     console.log(e);
        // }
    },
    waitForTicks: function (waitFor) {
        if (undefined === Memory.timeCount) {
            Memory.timeCount = 0;
            count = 0;
        }
        // console.log("Is true? "+(Memory.timeCount < waitFor && count != Memory.timeCount)+" Memory.timeCount "+Memory.timeCount+" < waitFor "+waitFor+" && undefined != count "+ count+" is true? "+(undefined != count));
        if (Memory.timeCount < waitFor && undefined !== count) {
            console.log("Count. " + count + " memory: " + Memory.timeCount);
            count = count + 1;
            Memory.timeCount = count;
            return false;
        } else {
            delete Memory.timeCount;
            return true;
        }
    },
    notEnoughCarrier: function () {
        let carryGround = [];
        for (flag in Memory.flags) {
            if (Game.flags[flag].name.includes("Mining")) {
                carryGround.push(Game.flags[flag]);
            }
        }
        let carrier = _.filter(Game.creeps, (creep) => creep.memory.role === 'carrier');
        return carrier.length < carryGround.length;
    },
    checkForContainerAtMiningSide: function (flag) {
        try {
            // let miningFlag;
            // // let container = miningflag.pos.lookFor(LOOK_STRUCTURES).filter(structure => {
            // //     return structure.structureType === STRUCTURE_CONTAINER
            // // })[0];
            // for (flag in Memory.flags) {
            //     if (Game.flags[flag].name.includes("Mining")) {
            //         miningFlag = Game.flags[flag];
            //     }
            // }
            let miningFlag = Game.flags[flag];
            if (miningFlag !== undefined) {
                if (miningFlag) {
                    let container = Game.flags[flag].pos.lookFor(LOOK_STRUCTURES).filter(structure => {
                        return structure.structureType === STRUCTURE_CONTAINER
                    })[0];
                    if (container) {
                        return true;
                    } else {
                        if (miningFlag.pos.lookFor(LOOK_CONSTRUCTION_SITES).length < 1) {
                            miningFlag.pos.createConstructionSite(STRUCTURE_CONTAINER);
                            return false;
                        } else
                            return false;
                    }

                } else {
                    return "Something wrong!";
                }
            } else return true;
        } catch (e) {
            console.log(e.stack);
        }
    },
    checkForFalslyUsedFlag: function () {
        try {
            let name;
            let miningFlags;

            for (flag in Memory.flags) {
                if (Game.flags[flag].name.includes("Mining")) {
                    for (name in Memory.creeps) {
                        if (!Game.creeps[name]) {
                            if (name === Game.flags[flag].memory.usedBy) {
                                delete Game.flags[flag].memory.usedBy;
                            } else if (name === Game.flags[flag].memory.carried) {
                                delete Game.flags[flag].memory.carried;
                            }
                        }
                    }
                }
            }

        } catch (e) {
            console.log(e.stack);
        }
    }
};

module.exports = utilCommon;