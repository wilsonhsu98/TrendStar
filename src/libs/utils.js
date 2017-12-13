var utils = exports;

utils.genStatistics = function(players, records, filterPA, filterGames) {
    // filterPA = filterPA || 10;
    let sortRecords = JSON.parse(JSON.stringify(records));

    sortRecords = sortRecords.sort((a, b) => {
        return parseInt(b._table.match(/\d/g).join('') + (b.order + 10), 10) -
            parseInt(a._table.match(/\d/g).join('') + (a.order + 10), 10)
    });

    return players.map(function(player) {
        var name = player.id,
            pa = 0,
            ab = 0,
            h = 0,
            tb = 0,
            tob = 0,
            r = 0,
            rbi = 0,
            h1 = 0,
            h2 = 0,
            h3 = 0,
            hr = 0,
            k = 0,
            bb = 0,
            sf = 0,
            dp = 0;

        var top = sortRecords
            .filter(function(item) { return filterGames === undefined || (Array.isArray(filterGames) && filterGames.length === 0) ? true : filterGames.indexOf(item._table) > -1; })
            .filter(function(item) { return item.name === name })
            .slice(0, filterPA);

        let limit = 1;
        var games = top
            .map(item => item._table)
            .filter(function(v, i, self) { return self.indexOf(v) === i; })
            .map((game) => {
                return sortRecords
                    .filter(function(item) { return item._table === game && item.name === name; })
                    .map(item => {
                        let color = 'blue';
                        if (['1H', '2H', '3H', 'HR'].indexOf(item.content) > -1) color = 'red';
                        if (['BB', '犧飛'].indexOf(item.content) > -1) color = 'yellow';
                        return {
                            name: item.name,
                            content: item.content,
                            order: item.order,
                            exclude: limit++ > filterPA,
                            color,
                        };
                    }).concat(game.substr(4));
            });


        top.forEach(function(item) {
            pa += 1;
            ab += ['1H', '2H', '3H', 'HR', '飛球', '滾地', 'K', 'E', '野選', '雙殺'].indexOf(item.content) > -1 ? 1 : 0;
            h += ['1H', '2H', '3H', 'HR'].indexOf(item.content) > -1 ? 1 : 0;
            tb += ['1H', '2H', '3H', 'HR'].indexOf(item.content) + 1;
            tob += ['1H', '2H', '3H', 'HR', 'BB'].indexOf(item.content) > -1 ? 1 : 0;
            r += item.r === item.name ? 1 : 0;
            rbi += item.rbi || 0;
            h1 += item.content === '1H' ? 1 : 0;
            h2 += item.content === '2H' ? 1 : 0;
            h3 += item.content === '3H' ? 1 : 0;
            hr += item.content === 'HR' ? 1 : 0;
            k += item.content === 'K' ? 1 : 0;
            bb += item.content === 'BB' ? 1 : 0;
            sf += item.content === '犧飛' ? 1 : 0;
            dp += item.content === '雙殺' ? 1 : 0;
        });

        var obj = {
            name: name,
            data: player.data,
            records: top,
            PA: '-',
            AB: '-',
            H: '-',
            TB: '-',
            TOB: '-',
            R: '-',
            RBI: '-',
            '1H': '-',
            '2H': '-',
            '3H': '-',
            HR: '-',
            K: '-',
            BB: '-',
            SF: '-',
            DP: '-',
            AVG: '-',
            OBP: '-',
            SLG: '-',
            OPS: '-',
            listByGame: games,
        };
        if (pa === 0) {} else if (pa > 0 && ab === 0) {
            obj = Object.assign(obj, {
                PA: pa,
                TOB: tob > 0 ? tob : '-',
                BB: bb > 0 ? bb : '-',
                SF: sf > 0 ? sf : '-',
                R: r > 0 ? r : '-',
                RBI: rbi > 0 ? rbi : '-',
                OBP: Math.round(tob / pa * 1000) / 1000,
                OPS: Math.round(tob / pa * 1000) / 1000
            });
        } else {
            obj = Object.assign(obj, {
                PA: pa,
                AB: ab,
                H: h,
                TB: tb,
                TOB: tob,
                R: r,
                RBI: rbi,
                '1H': h1,
                '2H': h2,
                '3H': h3,
                HR: hr,
                K: k,
                BB: bb,
                SF: sf,
                DP: dp,
                AVG: Math.round(h / ab * 1000) / 1000,
                OBP: Math.round(tob / pa * 1000) / 1000,
                SLG: Math.round(tb / ab * 1000) / 1000,
                OPS: Math.round((tob / pa + tb / ab) * 1000) / 1000
            });
        }

        return obj;
    });
};

utils.parseGame = function(arr) {
    var row = 1,
        col = 3,
        order = 1,
        result = [],
        scan = [],
        innArray = ['', '一', '二', '三', '四', '五', '六', '七'];
    while (col < arr[0].length && row < arr.length) {
        if (scan.indexOf(row + '' + col) === -1) {
            scan.push(row + '' + col);
            if (arr[row][col]) {
                var run = '';
                if (arr[row][col + 2] === 'R') {
                    run = arr[row][1];
                } else if (row + 1 < arr.length && arr[row + 1][col] === '' && arr[row + 1][col + 2] === 'R') {
                    run = arr[row + 1][1];
                }
                result.push({
                    order: order++,
                    inn: innArray.indexOf(arr[0][col]),
                    name: arr[row][1],
                    content: arr[row][col],
                    r: run,
                    rbi: arr[row][col + 1],
                    _row: row
                });
            }
        }
        row++;
        if (row === arr.length) {
            if (scan.indexOf('1' + col) === -1) {
                row = 1;
            } else {
                col += 3;
                if (result[result.length - 1]) {
                    if (result[result.length - 1]._row === arr.length - 1) {
                        row = 1;
                    } else {
                        row = result[result.length - 1]._row + 1
                    }
                } else {
                    row = 1;
                }
            }
        }
    }
    return result.map(function(item) {
        delete item._row;
        return item;
    });
};