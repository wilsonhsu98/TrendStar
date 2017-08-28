var utils = exports;

utils.genStatistics = function(players, records, filterPA) {
    filterPA = filterPA || 10;
    return players.map(function(name) {
        var pa = 0,
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

        var top = records.filter(function(item) { return item.name === name }).slice(0, filterPA);
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
        };
        if (pa === 0) {} else if (pa > 0 && ab === 0) {
            obj = Object.assign(obj, {
                PA: pa,
                TOB: tob > 0 ? tob : '-',
                BB: bb > 0 ? bb : '-',
                SF: sf > 0 ? sf : '-',
                R: r > 0 ? r : '-',
                RBI: rbi > 0 ? rbi : '-',
                OBP: Math.round(tob / pa * 100) / 100,
                OPS: Math.round(tob / pa * 100) / 100
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
                AVG: Math.round(h / ab * 100) / 100,
                OBP: Math.round(tob / pa * 100) / 100,
                SLG: Math.round(tb / ab * 100) / 100,
                OPS: Math.round((tob / pa + tb / ab) * 100) / 100
            });
        }

        return obj;
    });
};