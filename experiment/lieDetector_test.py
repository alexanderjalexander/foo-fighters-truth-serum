import unittest
import lieDetector_lastrun as LDLR


expInfo = LDLR.expInfo

class TestStringMethods(unittest.TestCase):
    def test_sessionInfo(self):
        self.assertEqual(LDLR.showExpInfoDlg(expInfo), expInfo)
        self.assertTrue(LDLR.setupData(expInfo).savePickle)
    
    def test_window(self):
        self.assertEqual(LDLR.setupWindow.color, [0,0,0])
        self.assertEqual(LDLR.setupWindow.colorSpace, 'rgb')
        self.assertEqual(LDLR.setupWindow.backgroundImage, '')
        self.assertEqual(LDLR.setupWindow.backgroundFit, 'none')
        self.assertEqual(LDLR.setupWindow.units, 'height')
        

if __name__ == '__main__':
    unittest.main()
